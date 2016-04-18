import Underscore from 'underscore';
import MetadataItem from './MetadataItem';
import Dataset from './Dataset';
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
    let self = this;

    self.status = {
      editable: false,
      location: null
    };
    
    self.listenTo(window.mainPage.currentUser, 'rra:login',
      self.updateStatus);
    self.listenTo(window.mainPage.currentUser, 'rra:logout',
      self.updateStatus);
    self.listenTo(window.mainPage.widgetPanels, 'rra:navigateWidgets',
      self.storePreferredWidgets);
  },
  updateStatus: Underscore.debounce(function (copyOnError) {
    let self = this;
    let id = self.getId();

    // Look up where the toolchain lives,
    // and whether the user can edit it
    
    if (id === undefined) {
      if (copyOnError) {
        self.makeCopy();
      } else {
        self.status = {
          editable: false,
          location: null
        };
        self.trigger('rra:changeStatus');
        return Promise.reject(new Error('Toolchain has no ID'));
      }
    }

    let statusPromise = Promise.resolve(girder.restRequest({
      path: 'item/' + id + '/info',
      type: 'GET'
    })).then((resp) => {
      self.status = resp;
    }).catch(() => {
      self.status = {
        editable: false,
        location: null
      };
      if (copyOnError) {
        self.makeCopy();
      }
    }).then(() => {
      self.trigger('rra:changeStatus');
    });

    return statusPromise;
  }, 300),
  makeCopy: function () {
    let self = this;
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
    
    self.unset('_id');
    return self.create()
      .then(() => {
        window.mainPage.trigger('rra:createToolchain');
        self.updateStatus();
      }).catch(_fail);
  },
  getMeta: function (key) {
    let self = this;
    let meta = MetadataItem.prototype.getMeta.apply(self, [key]);

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
        self.listenTo(meta.datasets, 'rra:changeSpec', self.changeSpec);
      }
      if (meta.preferredWidgets instanceof Array) {
        meta.preferredWidgets = new Set(meta.preferredWidgets);
      }
    } else if (key === 'datasets' && meta instanceof Array) {
      meta = new Dataset.Collection(meta);
      self.listenTo(meta, 'rra:changeSpec', self.changeSpec);
    } else if (key === 'preferredWidgets' && meta instanceof Array) {
      meta = new Set(meta.preferredWidgets);
    }

    return meta;
  },
  setMeta: function (key, value) {
    let self = this;
    let meta = self.get('meta') || {};
    
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
    self.set('meta', meta);
  },
  isEmpty: function () {
    let self = this;
    let meta = self.getMeta();
    return meta.datasets.length === 0 &&
      meta.visualizations.length === 0 &&
      meta.mappings.length === 0;
  },
  rename: function (newName) {
    let self = this;
    self.set('name', newName);
    self.save().then(() => {
      self.trigger('rra:rename');
    }).catch((errorObj) => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  getDatasetIds: function () {
    let self = this;
    let datasets = self.getMeta('datasets');
    let ids = [];
    datasets.each(function (dataset) {
      if (dataset.id) {
        ids.push(dataset.id);
      }
    });
    return ids;
  },
  setDataset: function (newDataset, index = 0) {
    let self = this;
    // Need to convert the raw girder.ItemModel
    // (when we add it to meta.datasets, it gets
    // auto-converted to our Dataset model)
    newDataset = newDataset.toJSON();

    let meta = self.getMeta();

    // Okay, we're actually swapping
    // in a different dataset
    if (index >= meta.datasets.length) {
      meta.datasets.push(newDataset);
      self.setMeta(meta);
    } else {
      let oldDataset = meta.datasets.at(index);
      if (oldDataset.get('_id') !== newDataset['_id']) {
        meta.datasets.remove(oldDataset);
        meta.datasets.add(newDataset, {
          at: index
        });
        // Swapping in a new dataset invalidates the mappings
        meta.mappings = [];
        self.setMeta(meta);
      }
    }
    self.save().then(() => {
      self.trigger('rra:changeDatasets');
      self.trigger('rra:changeMappings');
    }).catch((errorObj) => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  setVisualization: function (newVisualization, index = 0) {
    let self = this;
    let meta = self.getMeta();

    if (index >= meta.visualizations.length) {
      meta.visualizations.push(newVisualization);
      self.set('meta', meta);
    } else {
      if (meta.visualizations[index].name !== newVisualization.name) {
        meta.visualizations[index] = newVisualization;
        // Swapping in a new dataset invalidates the mappings
        meta.mappings = [];
        self.setMeta(meta);
      }
    }
    self.save().then(() => {
      self.trigger('rra:changeVisualizations');
      self.trigger('rra:changeMappings');
    }).catch((errorObj) => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  shapeDataForVis: function (callback, index = 0) {
    let self = this;
    let meta = self.getMeta();

    // TODO: use the mapping to transform
    // the parsed data into the shape that
    // the visualization expects
    let dataset = meta.datasets.at(0);
    if (!dataset) {
      callback([]);
    } else {
      dataset.getParsed(callback);
    }
  },
  getVisOptions: function (index = 0) {
    let self = this;
    let meta = self.getMeta();
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
    let self = this;
    if (self.validateMappings() === true) {
      // validateMappings will trigger this on its own
      // if the mappings were invalid
      self.trigger('rra:changeMappings');
    }
  },
  validateMappings: function () {
    let self = this;
    let meta = self.getMeta();

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
      self.setMeta(meta);
      self.save().then(() => {
        self.trigger('rra:changeMappings');
      });
      return false;
    } else {
      return true;
    }
  },
  addMapping: function (mapping) {
    let self = this;
    let meta = self.get('meta');

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

    self.setMeta(meta);
    self.save().then(() => {
      self.trigger('rra:changeMappings');
    }).catch((errorObj) => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  removeMapping: function (mapping) {
    let self = this;
    let meta = self.getMeta();

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

    self.setMeta(meta);
    self.save().then(() => {
      self.trigger('rra:changeMappings');
    }).catch((errorObj) => {
      window.mainPage.trigger('rra:error', errorObj);
    });
  },
  getAllWidgetSpecs: function () {
    let self = this;

    // Construct a list of all the widgets that
    // this toolchain needs
    let meta = self.getMeta();
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
    let self = this;
    self.setMeta('preferredWidgets',
      window.mainPage.widgetPanels.expandedWidgets);
  }
});

export default Toolchain;
