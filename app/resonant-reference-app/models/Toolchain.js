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

    self.listenTo(self, 'change', self.updateStatus);
  },
  updateStatus: function (copyOnError) {
    let self = this;
    let id = self.getId();

    // Look up where the toolchain lives,
    // and whether the user can edit it
    
    let oldStatus = {
      editable: self.status.editable,
      location: self.status.location
    };
    
    self.status = {
      editable: false,
      location: null
    };

    if (id === undefined) {
      if (copyOnError) {
        self.makeCopy();
      } else {
        throw new Error('Toolchain has no ID');
      }
    }

    let itemXhr = Promise.resolve(girder.restRequest({
      path: 'item/' + id,
      type: 'GET'
    }));

    let parentId = self.get('folderId');
    let parentAccessXhr = Promise.resolve(girder.restRequest({
      path: 'folder/' + parentId + '/access',
      type: 'GET',
      error: null
    }));

    let allXhr = Promise.all([itemXhr, parentAccessXhr]).then((responses) => {
      let item = responses[0];
      let folder = responses[1];

      if (item.baseParentType === 'user') {
        // Get information about where the toolchain item lives

        /* TODO: for now, I'm assuming the UI still makes sense,
        regardless of whether the user is looking at their own
        public/private items, or at a different user's public/private
        items that they have access to. If not, we may need to look up
        whether this actually is the same user */
        if (item.public === true) {
          self.status.location = 'UserPublic';
        } else {
          self.status.location = 'UserPrivate';
        }
      } else {
        if (folder.name === 'Public Scratch Space') {
          self.status.location = 'PublicScratch';
        } else {
          self.status.location = 'PublicLibrary';
        }
      }
      
      if (self.status.location === 'PublicScratch') {
        /*
          Use localStorage to do an easily-hackable "security"
          check (when people aren't logged in, we behave like
          jsfiddle) to see if this non-logged-in user was the one
          that created the public scratch item in the first place
        */
        let ownedToolchains = window.localStorage.getItem('scratchToolchains');
        if (ownedToolchains) {
          self.status.editable = JSON.parse(ownedToolchains)
            .indexOf(id) !== -1;
        }
      } else {
        // Get information about whether the current user has
        // write access to edit the item
        let userId = window.mainPage.currentUser.id;
        if (userId && folder && folder.users) {
          for (let i = 0; i < folder.users.length; i += 1) {
            if (folder.users[i].id === userId) {
              if (folder.users[i].level > 0) {
                self.status.editable = true;
              }
              break;
            }
          }
        }
      }
      
      if (self.status.editable !== oldStatus.editable ||
          self.status.location !== oldStatus.location) {
        self.trigger('rra:changeStatus');
      }
    });

    if (copyOnError) {
      allXhr = allXhr.catch(() => {
        self.makeCopy();
      });
    }

    return allXhr;
  },
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
    let _fail = function () {
      // If we can't even save a copy, something
      // is seriously wrong.
      window.mainPage.switchToolchain(null, arguments);
    }

    self.unset('_id');
    return Promise.resolve(girder.restRequest({
      path: 'item/scratchItem/',
      type: 'GET',
      error: _fail
    })).then(function (item) {
      self.set('_id', item.id);
      self.fetch({
        success: self.updateStatus,
        error: _fail
      })
    }).catch(_fail);
  },
  togglePublic: function () {
    let self = this;
    girder.restRequest({
      path: 'item/togglePublic/' + self.getId(),
      type: 'POST',
      error: self.updateStatus
    }).always(self.updateStatus);
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
    self.save().then(() => {
      self.trigger('rra:rename');
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
    });
  },
  getAllWidgetSpecs: function () {
    let self = this;

    // Construct a list of all the widgets that
    // this toolchain needs
    let meta = self.getMeta();
    let result = [];

    let i;
    for (i = 0; i < meta.datasets.length; i += 1) {
      result.push({
        widget: 'DatasetView',
        spec: meta.datasets.at(i).getSpec()
      });
    }
    result.push({
      widget: 'MappingView'
    });
    for (i = 0; i < meta.visualizations.length; i += 1) {
      result.push({
        widget: 'VisualizationView',
        spec: meta.visualizations[i]
      });
    }
  }
});

export default Toolchain;
