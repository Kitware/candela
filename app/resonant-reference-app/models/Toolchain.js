import Underscore from 'underscore';
import MetadataItem from './MetadataItem';
import Dataset from './Dataset';
import {
  Set
}
from '../shims/SetOps.js';
let girder = window.girder;
/*
    A Toolchain represents a user's saved session;
    it includes specific dataset IDs, with specific
    mappings to specific visualizations (in the future,
    this may also include faceting settings, etc).

    Though behind the scenes we're making room for multiple
    datasets and multiple visualizations,
    for now, toolchains are expected to only contain one
    dataset and one visualization. Any more are ignored
    by the currently implemented views.
*/

let Toolchain = MetadataItem.extend({
  defaults: function () {
    return {
      name: 'Untitled Toolchain',
      meta: {
        datasets: [],
        mappings: [],
        visualizations: [],
        preferredWidgets: []
      }
    };
  },
  initialize: function () {
    this.status = {
      editable: false,
      location: null
    };

    this.listenTo(window.mainPage.currentUser, 'rra:login',
      this.updateStatus);
    this.listenTo(window.mainPage.currentUser, 'rra:logout',
      this.updateStatus);
    this.listenTo(window.mainPage.widgetPanels, 'rra:navigateWidgets',
      this.storePreferredWidgets);
  },
  updateStatus: Underscore.debounce(function (copyOnError) {
    let id = this.getId();

    // Look up where the toolchain lives,
    // and whether the user can edit it

    if (id === undefined) {
      if (copyOnError) {
        this.makeCopy();
      } else {
        this.status = {
          editable: false,
          location: null
        };
        this.trigger('rra:changeStatus');
        return Promise.reject(new Error('Toolchain has no ID'));
      }
    }
    
    // Load up any datasets that the toolchain references
    let datasetPromises = [];

    this.getMeta('datasets').forEach(datasetId => {
      datasetPromises.push(Promise.resolve(girder.restRequest({
        path: 'item/' + datasetId,
        type: 'GET'
      })));
    });
    Promise.all(datasetPromises).catch(errorObj => {
      window.mainPage.trigger('rra:error', errorObj);
    }).then(respObjects => {
      if (!respObjects) {
        window.mainPage.trigger('rra:error',
          new Error('Could not access this toolchain\'s dataset(s)'));
      } else {
        respObjects.forEach(resp => {
          let newDataset = new Dataset(resp);
          this.listenTo(newDataset, 'rra:changeSpec', this.changeDataSpec);
          this.listenTo(newDataset, 'rra:swapId', this.swapDatasetId);
        });
      }
      this.trigger('rra:changeDatasets');
    });
    
    // Get access information about this toolchain
    let statusPromise = Promise.resolve(girder.restRequest({
      path: 'item/' + id + '/info',
      type: 'GET'
    })).then((resp) => {
      this.status = resp;
    }).catch(() => {
      this.status = {
        editable: false,
        location: null
      };
      if (copyOnError) {
        this.makeCopy();
      }
    }).then(() => {
      this.trigger('rra:changeStatus');
    });

    return statusPromise;
  }, 300),
  makeCopy: function () {
    /*
    When something weird happens (e.g. the user is
    trying to edit a toolchain that they don't have write
    access to, or the toolchain is in an unexpected location),
    we want to make sure that the user's actions are still
    always saved. This function copies the current state of
    the toolchain to either the user's Private directory, or
    to the public scratch space if the user is logged out
    */
    let _fail = function (err) {
      // If we can't even save a copy, something
      // is seriously wrong.
      window.mainPage.switchToolchain(null);
      window.mainPage.trigger('rra:error', err);
    }

    this.unset('_id');
    return this.create()
      .then(() => {
        window.mainPage.trigger('rra:createToolchain');
        this.updateStatus();
      }).catch(_fail);
  },
  getMeta: function (key) {
    let meta = MetadataItem.prototype.getMeta.apply(this, [key]);

    /*
      Everything in metadata is squashed down into JSON-compatible
      objects; by overriding getMeta(), we can wrap everything in
      the special objects each thing is supposed to be
    */

    if (key === undefined) {
      if (meta.preferredWidgets instanceof Array) {
        meta.preferredWidgets = new Set(meta.preferredWidgets);
      }
    } else if (key === 'preferredWidgets' && meta instanceof Array) {
      meta = new Set(meta.preferredWidgets);
    }

    return meta;
  },
  setMeta: function (key, value) {
    let meta = this.get('meta') || {};

    /*
      For the same reason as getMeta, we need to override setMeta
      so that we appropriately handle the flattening process
    */

    if (typeof key === 'object') {
      let obj = key;
      for (key of Object.keys(obj)) {
        meta[key] = obj[key];
        if (key === 'preferredWidgets' &&
          meta[key] instanceof Set) {
          meta[key] = [...meta[key]];
        }
      }
    } else {
      meta[key] = value;
    }
    this.set('meta', meta);
  },
  isEmpty: function () {
    let meta = this.getMeta();
    return meta.datasets.length === 0 &&
      meta.visualizations.length === 0 &&
      meta.mappings.length === 0;
  },
  rename: function (newName) {
    this.set('name', newName);
    this.save().then(() => {
      this.trigger('rra:rename');
    }).catch((errorObj) => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  getDatasetIds: function () {
    return this.getMeta('datasets');
  },
  changeDataSpec: function () {
    this.validateMappings();
    this.trigger('rra:changeDatasets');
  },
  swapDatasetId: function (newData) {
    let datasets = this.getMeta('datasets');
    let index = datasets.indexOf(newData._oldId);
    if (index !== -1) {
      datasets[index] = newData._id;
      this.setMeta('datasets', datasets);
    } else {
      window.mainPage.trigger('rra:error',
        new Error('Encountered a problem handling swapped dataset id'));
    }
  },
  setDataset: function (newDataset, index = 0) {
    // Need to convert the raw girder.ItemModel
    newDataset = new Dataset(newDataset.toJSON());
    this.listenTo(newDataset, 'rra:changeSpec', this.changeDataSpec);
    this.listenTo(newDataset, 'rra:swapId', this.swapDatasetId);
    let newId = newDataset.getId();
    let datasets = this.getMeta('datasets');

    if (index >= datasets.length) {
      datasets.push(newId);
    } else {
      let oldDataset = window.mainPage.loadedDatasets[datasets[index]];
      if (oldDataset) {
        // If the dataset hasn't already dropped itself...
        this.stopListening(oldDataset, 'rra:changeSpec', this.changeDataSpec);
        this.stopListening(oldDataset, 'rra:swapId', this.swapDatasetId);
        oldDataset.drop();
      }
      datasets[index] = newId;
    }
    this.setMeta('datasets', datasets);
    this.save().then(() => {
      this.trigger('rra:changeDatasets');
      this.validateMappings();
    }).catch((errorObj) => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  setVisualization: function (newVisualization, index = 0) {
    let visualizations = this.getMeta('visualizations');

    if (index >= visualizations.length) {
      visualizations.push(newVisualization);
    } else {
      visualizations[index] = newVisualization;
    }
    this.setMeta('visualizations', visualizations);
    this.save().then(() => {
      this.trigger('rra:changeVisualizations');
      this.validateMappings();
    }).catch((errorObj) => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  shapeDataForVis: function (index = 0) {
    let meta = this.getMeta();

    // TODO: use the mapping to transform
    // the parsed data into the shape that
    // the visualization expects
    let datasetId = meta.datasets[0];
    if (!window.mainPage.loadedDatasets[datasetId]) {
      return Promise.resolve([]);
    } else {
      return window.mainPage.loadedDatasets[datasetId].parse();
    }
  },
  getVisOptions: function (index = 0) {
    let meta = this.getMeta();
    let options = {};

    // Figure out which options allow multiple fields
    meta.mappings.forEach(mapping => {
      for (let optionSpec of meta.visualizations[mapping.visIndex].options) {
        if (optionSpec.name === mapping.visAttribute) {
          if (optionSpec.type === 'string_list') {
            options[mapping.visAttribute] = [];
          }
          break;
        }
      }
    });

    // Construct the options
    meta.mappings.forEach(mapping => {
      if (Array.isArray(options[mapping.visAttribute])) {
        options[mapping.visAttribute].push(mapping.dataAttribute);
      } else {
        options[mapping.visAttribute] = mapping.dataAttribute;
      }
    });
    return options;
  },
  validateMappings: function () {
    let meta = this.getMeta();

    // Go through all the mappings and make sure that:
    // 1. The referenced dataset and visualization
    //    are still in this toolchain
    // 2. The dataset and visualization still have
    //    the named attribute
    // 3. The data types are still compatible
    // 4. TODO: Other things we should check?
    // Trash any mappings that don't make sense anymore
    let indicesToTrash = [];
    for (let [index, mapping] of meta.mappings.entries()) {
      if (meta.datasets.length <= mapping.dataIndex ||
        meta.visualizations.length <= mapping.visIndex) {
        indicesToTrash.push(index);
        continue;
      }

      let dataset = window.mainPage.loadedDatasets[meta.datasets[mapping.dataIndex]];
      if (!dataset) {
        indicesToTrash.push(index);
        continue;
      }

      let dataType = dataset.getSpec()
        .attributes[mapping.dataAttribute];
      let optionSpec = meta.visualizations[mapping.visIndex]
        .options.find(spec => spec.name === mapping.visAttribute);

      if (!dataType || !optionSpec) {
        indicesToTrash.push(index);
        continue;
      }

      if (optionSpec.domain.fieldTypes.indexOf(dataType) === -1) {
        indicesToTrash.push(index);
      }
    }

    for (let index of indicesToTrash.reverse()) {
      meta.mappings.splice(index, 1);
    }

    this.setMeta(meta);
    this.save().then(() => {
      this.trigger('rra:changeMappings');
    }).catch(errorObj => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  addMapping: function (mapping) {
    let meta = this.get('meta');

    // Figure out if the vis option allows multiple fields
    let optionSpec = meta.visualizations[mapping.visIndex]
      .options.find(spec => spec.name === mapping.visAttribute);

    // If the vis option doesn't allow multiple fields,
    // remove any existing mappings for that vis option
    if (optionSpec.type !== 'string_list') {
      meta.mappings = meta.mappings.filter(m => {
        return m.visIndex !== mapping.visIndex ||
          m.visAttribute !== mapping.visAttribute;
      });
    }

    // Add the mapping
    meta.mappings.push(mapping);

    this.setMeta(meta);
    this.save().then(() => {
      this.trigger('rra:changeMappings');
    }).catch(errorObj => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  removeMapping: function (mapping) {
    let mappings = this.getMeta('mappings');

    let index;
    let temp = mappings.find((m, i) => {
      index = i;
      return mapping.visIndex === m.visIndex &&
        mapping.visAttribute === m.visAttribute &&
        mapping.dataIndex === m.dataIndex &&
        mapping.dataAttribute === m.dataAttribute;
    });
    if (temp) {
      mappings.splice(index, 1);
    }
    this.setMeta('mappings', mappings);
    this.save().then(() => {
      this.trigger('rra:changeMappings');
    }).catch(errorObj => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  getAllWidgetSpecs: function () {
    // Construct a list of all the widgets that
    // this toolchain needs
    let meta = this.getMeta();
    let result = [];

    meta.datasets.forEach((id, i) => {
      result.push({
        widgetType: 'DatasetView',
        hashName: 'DatasetView' + id,
        index: i,
        id: id
      });
    });
    result.push({
      widgetType: 'MappingView',
      hashName: 'MappingView'
    });
    meta.visualizations.forEach((spec, i) => {
      result.push({
        widgetType: 'VisualizationView',
        hashName: 'VisualizationView' + spec.name + i,
        index: i,
        spec: spec
      });
    });

    return result;
  },
  storePreferredWidgets: function () {
    this.setMeta('preferredWidgets',
      window.mainPage.widgetPanels.expandedWidgets);
  }
});

export default Toolchain;
