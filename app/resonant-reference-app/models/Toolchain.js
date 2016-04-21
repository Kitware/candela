import Underscore from 'underscore';
import MetadataItem from './MetadataItem';
import Dataset from './Dataset';
import {Set} from '../shims/SetOps.js';
let girder = window.girder;
/*
    A Toolchain represents a user's saved session;
    it includes specific datasets, with specific
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
      the special objects each thing is supposed to be, and
      re-attach any listeners that would have been lost in
      round-trips to the server
    */

    if (key === undefined) {
      if (meta.datasets instanceof Array) {
        meta.datasets = new Dataset.Collection(meta.datasets);
        this.listenTo(meta.datasets, 'rra:changeSpec', this.changeSpec);
        this.listenTo(meta.datasets, 'rra:swapId', this.swapDataset);
      }
      if (meta.preferredWidgets instanceof Array) {
        meta.preferredWidgets = new Set(meta.preferredWidgets);
      }
    } else if (key === 'datasets' && meta instanceof Array) {
      meta = new Dataset.Collection(meta);
      this.listenTo(meta, 'rra:changeSpec', this.changeSpec);
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
    let datasets = this.getMeta('datasets');
    let ids = [];
    datasets.each(function (dataset) {
      if (dataset.id) {
        ids.push(dataset.id);
      }
    });
    return ids;
  },
  swapDataset: function (newDataset) {
    // A dataset has changed behind the scenes (e.g. a
    // copy was made)... if the ID is different, Backbone
    // isn't going to update it for us. Instead, we need to
    // swap out the old copy for the new one that we were using
    let datasets = this.getMeta('datasets');
    let oldDataset = datasets.get(newDataset._oldId);
    let index = datasets.indexOf(oldDataset);
    datasets.remove(oldDataset);
    oldDataset.markObsolete();
      
    delete newDataset._oldId;
    datasets.add(newDataset, {
      at: index
    });

    this.setMeta('datasets', datasets);
  },
  setDataset: function (newDataset, index = 0) {
    // Need to convert the raw girder.ItemModel
    // (when we add it to meta.datasets, it gets
    // auto-converted to our Dataset model)
    newDataset = newDataset.toJSON();

    let meta = this.getMeta();

    // Okay, we're actually swapping
    // in a different dataset
    if (index >= meta.datasets.length) {
      meta.datasets.push(newDataset);
      this.setMeta(meta);
    } else {
      let oldDataset = meta.datasets.at(index);
      if (oldDataset.get('_id') !== newDataset['_id']) {
        meta.datasets.remove(oldDataset);
        meta.datasets.add(newDataset, {
          at: index
        });
        // Swapping in a new dataset invalidates the mappings
        meta.mappings = [];
        this.setMeta(meta);
      }
    }
    this.save().then(() => {
      this.trigger('rra:changeDatasets');
      this.trigger('rra:changeMappings');
    }).catch((errorObj) => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  setVisualization: function (newVisualization, index = 0) {
    let meta = this.getMeta();

    if (index >= meta.visualizations.length) {
      meta.visualizations.push(newVisualization);
      this.set('meta', meta);
    } else {
      if (meta.visualizations[index].name !== newVisualization.name) {
        meta.visualizations[index] = newVisualization;
        // Swapping in a new dataset invalidates the mappings
        meta.mappings = [];
        this.setMeta(meta);
      }
    }
    this.save().then(() => {
      this.trigger('rra:changeVisualizations');
      this.trigger('rra:changeMappings');
    }).catch((errorObj) => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  shapeDataForVis: function (index = 0) {
    let meta = this.getMeta();

    // TODO: use the mapping to transform
    // the parsed data into the shape that
    // the visualization expects
    let dataset = meta.datasets.at(0);
    if (!dataset) {
      return Promise.resolve([]);
    } else {
      return dataset.parse();
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
  changeSpec: function () {
    if (this.validateMappings() === true) {
      // validateMappings will trigger this on its own
      // if the mappings were invalid
      this.trigger('rra:changeMappings');
    }
  },
  validateMappings: function () {
    let meta = this.getMeta();

    // Go through all the mappings and make sure that:
    // 1. The data types are still compatible
    //    (trash them if they're not)
    // 2. TODO: Other things we should check?
    let indicesToTrash = [];
    for (let [index, mapping] of meta.mappings.entries()) {
      let dataType = meta.datasets.at(mapping.dataIndex)
        .getSpec().attributes[mapping.dataAttribute];

      let possibleTypes = [];
      for (let optionSpec of meta.visualizations[mapping.visIndex].options) {
        if (optionSpec.name === mapping.visAttribute) {
          possibleTypes = optionSpec.domain.fieldTypes;
          break;
        }
      }

      if (possibleTypes.indexOf(dataType) === -1) {
        indicesToTrash.push(index);
      }
    }

    for (let index of indicesToTrash) {
      meta.mappings.splice(index, 1);
    }

    if (indicesToTrash.length > 0) {
      this.setMeta(meta);
      this.save().then(() => {
        this.trigger('rra:changeMappings');
      }).catch(errorObj => {
        window.mainPage.trigger('rra:error', errorObj);
      });
      return false;
    } else {
      return true;
    }
  },
  addMapping: function (mapping) {
    let meta = this.get('meta');

    // Figure out if the vis option allows multiple fields
    let addedMapping = false;
    for (let optionSpec of meta.visualizations[mapping.visIndex].options) {
      if (optionSpec.name === mapping.visAttribute) {
        if (optionSpec.type !== 'string_list') {
          // If multiple fields are not allowed, search for the mapping and replace it
          for (let [index, m] of meta.mappings.entries()) {
            if (mapping.visIndex === m.visIndex &&
              mapping.visAttribute === m.visAttribute) {
              meta.mappings[index] = mapping;
              addedMapping = true;
              break;
            }
          }
        }
        break;
      }
    }

    if (!addedMapping) {
      meta.mappings.push(mapping);
    }

    this.setMeta(meta);
    this.save().then(() => {
      this.trigger('rra:changeMappings');
    }).catch((errorObj) => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  removeMapping: function (mapping) {
    let meta = this.getMeta();

    let mappingToSplice = null;
    for (let [index, m] of meta.mappings.entries()) {
      if (mapping.visIndex === m.visIndex &&
        mapping.visAttribute === m.visAttribute &&
        mapping.dataIndex === m.dataIndex &&
        mapping.dataAttribute === m.dataAttribute) {
        mappingToSplice = index;
        break;
      }
    }
    if (mappingToSplice !== null) {
      meta.mappings.splice(mappingToSplice, 1);
    }

    this.setMeta(meta);
    this.save().then(() => {
      this.trigger('rra:changeMappings');
    }).catch((errorObj) => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  getAllWidgetSpecs: function () {
    // Construct a list of all the widgets that
    // this toolchain needs
    let meta = this.getMeta();
    let result = [];
    let widgetSpec;

    let i;
    for (i = 0; i < meta.datasets.length; i += 1) {
      widgetSpec = {
        widgetType: 'DatasetView',
        index: i,
        spec: meta.datasets.at(i).getSpec()
      };
      widgetSpec.hashName = 'DatasetView' + i;
      result.push(widgetSpec);
    }
    result.push({
      widgetType: 'MappingView',
      hashName: 'MappingView'
    });
    for (i = 0; i < meta.visualizations.length; i += 1) {
      widgetSpec = {
        widgetType: 'VisualizationView',
        index: i,
        spec: meta.visualizations[i]
      };
      widgetSpec.hashName = 'VisualizationView' + i;
      result.push(widgetSpec);
    }

    return result;
  },
  storePreferredWidgets: function () {
    this.setMeta('preferredWidgets',
      window.mainPage.widgetPanels.expandedWidgets);
  }
});

export default Toolchain;
