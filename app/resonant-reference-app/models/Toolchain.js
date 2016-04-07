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
  /*
    resetToDefaults doesn't work unless defaults
    is a function. If defaults are a simple object,
    changes to the model mutate the defaults object.
  */
  defaults: () => {
    return {
      name: 'Untitled Toolchain',
      meta: {
        datasets: [],
        mappings: [],
        visualizations: [],
        preferredWidgets: [],
        requiredIcons: [
          'DatasetView',
          'MappingView',
          'VisualizationView'
        ]
      }
    };
  },
  initialize: function () {
    let self = this;
    
    self.isPublic = undefined;

    self.listenTo(self, 'change', () => {
      self.getVisibility();
    });

    if (self.getId() !== undefined) {
      // We actually have some settings!
      // Get them from the server
      self.fetch();
    }
  },
  getVisibility: function () {
    let self = this;
    let parentId = self.get('folderId');

    if (parentId) {
      // Look up which folder the toolchain lives in
      girder.restRequest({
        path: 'folder/' + parentId,
        type: 'GET',
        error: function () {
          self.isPublic = undefined;
        }
      }).done(function (folder) {
        if (folder && folder['name']) {
          if (folder['name'] === 'Public') {
            self.isPublic = true;
          } else if (folder['name'] === 'Private') {
            self.isPublic = false;
          } else {
            self.isPublic = undefined;
          }
        } else {
          self.isPublic = undefined;
        }
      });
    }
  },
  togglePublic: function () {
    let self = this;
    let id = self.getId();

    if (id && self.isPublic !== undefined) {
      girder.restRequest({
        path: 'item/togglePublic/' + id,
        type: 'POST',
        error: function () {
          self.isPublic = undefined;
        }
      }).done(function (newState) {
        self.isPublic = newState;
        self.trigger('change');
      });
    }
  },
  getMeta: function (key) {
    let self = this;
    let meta = MetadataItem.prototype.getMeta.apply(self, [key]);

    if (key === undefined) {
      if (meta.datasets instanceof Array) {
        meta.datasets = new Dataset.Collection(meta.datasets);
        self.listenTo(meta.datasets, 'rra:changeSpec', self.changeSpec);
      }
    } else if (key === 'datasets' && meta instanceof Array) {
      meta = new Dataset.Collection(meta);
      self.listenTo(meta, 'rra:changeSpec', self.changeSpec);
    }

    return meta;
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
    self.save();
  },
  resetToDefaults: function () {
    let self = this;
    self.clear({
      silent: true
    });
    self.set(self.defaults());
    self.isPublic = undefined;
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
    self.save();
    self.trigger('rra:changeDatasets');
    self.trigger('rra:changeMappings');
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
    self.save();
    self.trigger('rra:changeVisualizations');
    self.trigger('rra:changeMappings');
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
      self.save();
      self.trigger('rra:changeMappings');
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
    self.save();
    self.trigger('rra:changeMappings');
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
    self.save();
    self.trigger('rra:changeMappings');
  },
  closeWidget: function (widgetName) {
    let self = this;
    // Remove widgetName from the list of widgets that this
    // toolchain last had open (save the new configuration)
    let widgetList = self.getMeta('preferredWidgets');
    let index = widgetList.indexOf(widgetName);
    if (index !== -1) {
      widgetList.splice(index, 1);
      self.setMeta('preferredWidgets', widgetList);
      self.save();
      self.trigger('rra:changeWidget');
    }
  },
  openWidget: function (widgetName) {
    let self = this;

    // Figure out where the widget should go;
    // it should match the order of the icons
    let iconList = self.getMeta('requiredIcons');
    let widgetList = self.getMeta('preferredWidgets');

    if (iconList.indexOf(widgetName) === -1) {
      throw new Error(`Attempted to open a widget that
        isn't on the toolbar: ` + widgetName);
    }
    if (widgetList.indexOf(widgetName) !== -1) {
      // The widget is already open
      return;
    }

    // TODO: probably a more efficient way to do this...
    widgetList.push(widgetName);
    widgetList.sort((a, b) => {
      return iconList.indexOf(a) - iconList.indexOf(b);
    });

    self.setMeta('preferredWidgets', widgetList);
    self.save();
    self.trigger('rra:changeWidget');
  }
});

export default Toolchain;
