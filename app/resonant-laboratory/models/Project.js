import MetadataItem from './MetadataItem';
import Dataset from './Dataset';
import binUtils from '../general_purpose/binUtils.js';
import { Set } from '../shims/SetOps.js';
import candela from '../../../src/candela';
/*
    A Project represents a user's saved session;
    it includes specific dataset IDs, with specific
    matchings to specific visualizations (in the future,
    this may also include faceting settings, etc).

    Though behind the scenes we're making room for multiple
    datasets and multiple visualizations,
    for now, projects are expected to only contain one
    dataset and one visualization. Any more are ignored
    by the currently implemented views.
*/

class ProjectCache {
  constructor (model) {
    this.model = model;
    this.visDatasetPromises = {};
  }
  invalidate () {
    this.status = null;
    this.loadedDatasets = null;
    this.visDatasetPromises = {};
  }
  get status () {
    if (!this._status) {
      if (!this.model.getId()) {
        // This is a new project
        this._status = Promise.resolve({
          editable: false,
          visibility: null,
          path: null
        });
      } else {
        this._status = this.model.restRequest({
          'path': 'anonymousAccess/info'
        });
      }
      this._status.then(() => {
        this.model.trigger('rl:changeStatus');
      });
    }
    return this._status;
  }
  set status (value) {
    // The only reason to set the status is to signal
    // that it's out of date
    delete this._status;
    this.model.trigger('rl:changeStatus');
  }
  get loadedDatasets () {
    if (!this._loadedDatasets) {
      this._loadedDatasets = {};
    }
    if (this._datasetCacheIsValid) {
      return Promise.resolve(this._loadedDatasets);
    } else {
      // Update our list of loaded datasets to correspond to those
      // listed in the project's metadata
      return this.model.fetch().then(() => {
        let changedDatasets = false;
        let datasetPromises = [];
        let newLoadedDatasets = {};

        // Get the new list of datasets from project metadata
        let datasetSpecs = this.model.getMeta('datasets');
        datasetSpecs.forEach((datasetSpec, index) => {
          let datasetObj;
          if (datasetSpec.dataset in this._loadedDatasets) {
            // We've already loaded this dataset; update its filter and
            // paging parameters
            datasetObj = this._loadedDatasets[datasetSpec.dataset];
          } else {
            // We haven't loaded this dataset yet; load it and
            // attach some listeners
            datasetObj = new Dataset({
              _id: datasetSpec.dataset
            });
            this.model.listenToDataset(datasetObj);
            changedDatasets = true;
          }
          // Update the filter and paging paramters from the
          // project's metadata
          if (datasetSpec.filter) {
            datasetObj.cache.filter = datasetSpec.filter;
          }
          if (datasetSpec.page) {
            datasetObj.cache.page = datasetSpec.page;
          }
          newLoadedDatasets[datasetSpec.dataset] = datasetObj;
          datasetPromises.push(datasetObj.fetch());
        });
        // Now go through and discard any references to
        // old datasets that we don't need anymore
        Object.keys(this._loadedDatasets).forEach(datasetId => {
          if (!(datasetId in newLoadedDatasets)) {
            // Flag this dataset as one that isn't being used anymore
            // in case anyone (e.g. a view) is still holding a reference
            // to it, so that we don't accidentally try to save anything
            // about it anymore
            changedDatasets = true;
            this._loadedDatasets[datasetId].dropped = true;
            this._loadedDatasets[datasetId].stopListening();
            this.model.ignoreDataset(this._loadedDatasets[datasetId]);
            delete this._loadedDatasets[datasetId];
          }
        });
        this._loadedDatasets = newLoadedDatasets;
        this._datasetCacheIsValid = true;

        // Return a promise that resolves when all the
        // datasets have been fetched
        let responsePromise = Promise.all(datasetPromises).then(() => {
          return this._loadedDatasets;
        });
        if (changedDatasets) {
          // If our datasets changed, the matchings probably will too
          responsePromise.then(() => {
            this.model.checkAndSaveMatchings(['rl:changeDatasets']);
          });
        }
        return responsePromise;
      });
    }
  }
  set loadedDatasets (value) {
    // The only reason to set loadedDatasets is to signal
    // that the cache is out of date
    this._datasetCacheIsValid = false;
    this.visDatasetPromises = {};
    this.model.checkAndSaveMatchings(['rl:changeDatasets']);
  }
}

let Project = MetadataItem.extend({
  defaults: () => {
    return {
      'name': 'Untitled Project',
      'meta': {
        'rlab': {
          datasets: [],
          matchings: [],
          visualizations: [],
          preferredWidgets: []
        }
      }
    };
  },
  initialize: function () {
    this.cache = new ProjectCache(this);

    this.listenTo(window.mainPage.currentUser, 'rl:login',
      this.cache.invalidate);
    this.listenTo(window.mainPage.currentUser, 'rl:logout',
      this.cache.invalidate);
    this.listenTo(window.mainPage, 'rl:changeProject',
      this.cache.invalidate);
    this.listenTo(window.mainPage.widgetPanels, 'rl:navigateWidgets',
      this.storePreferredWidgets);
  },
  updateStatus: function () {
    this.cache.status = null;
  },
  create: function () {
    let createPromise = MetadataItem.prototype.create
      .apply(this, arguments).then(() => {
        // Hit the endpoint that identifies the item as a project
        return this.restRequest({
          path: 'project',
          method: 'POST'
        }).then(resp => {
          this.set(resp);
          return resp;
        });
      });
    createPromise.then(() => {
      // Flag this project as "ours" (esp. for the case when
      // the user is logged out, store the project item info
      // in localStorage)
      window.mainPage.currentUser.preferences.claimProject();
      // Let everyone know about the new project
      window.mainPage.trigger('rl:createProject');
    });
    return createPromise;
  },
  save: function () {
    // Prevent any lingering attempts to save the
    // project once the project has been closed
    if (window.mainPage.project !== this) {
      return Promise.resolve(null);
    } else {
      return MetadataItem.prototype.save.apply(this, arguments);
    }
  },
  rename: function () {
    // Renaming the project invalidates its status
    return MetadataItem.prototype.rename.apply(this, arguments)
      .then(() => {
        this.updateStatus();
      });
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
  getFlatMeta: function () {
    /*
      For the same reason as getMeta, MetadataItem needs to be
      able to get a flattened copy of the metadata for
      JSON.stringification
    */

    let meta = this.getMeta() || {};
    let flatMeta = {};

    for (let key of Object.keys(meta)) {
      if (key === 'preferredWidgets' &&
        meta[key] instanceof Set) {
        flatMeta[key] = [...meta[key]];
      } else {
        flatMeta[key] = meta[key];
      }
    }
    return flatMeta;
  },
  getDatasetId: function (index) {
    let datasets = this.getMeta('datasets');
    if (datasets && datasets.length > index) {
      return datasets[index].dataset;
    } else {
      return null;
    }
  },
  getDataset: function (index) {
    return this.cache.loadedDatasets.then(loadedDatasets => {
      let datasetId = this.getDatasetId(index);
      if (datasetId) {
        return loadedDatasets[datasetId];
      } else {
        return null;
      }
    });
  },
  getDatasetIds: function () {
    return (this.getMeta('datasets') || []).map(d => d.dataset);
  },
  swapDatasetId: function (datasetObj, oldId) {
    let newId = datasetObj.getId();
    this.cache.loadedDatasets.then(loadedDatasets => {
      if (newId in loadedDatasets) {
        // Another response from the server has already triggered this function
        // and dealt with everything, so we don't have to worry about it.
        return;
      } else {
        // Okay, this dataset has been moved, and we're the first to
        // know about it. Update the project metadata to point to the
        // new dataset - this invalidates the loadedDatasets cache
        let datasets = this.getMeta('datasets');
        let index = datasets.findIndex(d => d.dataset === oldId);
        if (index !== -1 && oldId in loadedDatasets) {
          datasets[index] = {
            dataset: newId,
            filter: datasetObj.cache.filter,
            page: datasetObj.cache.page
          };
          this.cache.loadedDatasets = null;
          this.setMeta('datasets', datasets);
          this.save().then(() => {
            this.trigger('rl:swappedDatasetId');
          });
        } else {
          window.mainPage.trigger('rl:error',
            new Error('Couldn\'t update the reference to a copy of the ' +
                      datasetObj.get('name') + ' dataset.'));
        }
      }
    });
  },
  listenToDataset: function (datasetObj) {
    this.listenTo(datasetObj, 'rl:updatedSchema', this.checkAndSaveMatchings);
    this.listenTo(datasetObj, 'rl:swappedId', oldId => {
      this.swapDatasetId(datasetObj, oldId);
    });
    this.listenTo(datasetObj, 'rl:updatePage', () => {
      this.updateDatasetPage(datasetObj);
    });
  },
  ignoreDataset: function (datasetObj) {
    this.stopListening(datasetObj, 'rl:updatedSchema');
    this.stopListening(datasetObj, 'rl:swappedId');
    this.stopListening(datasetObj, 'rl:updatePage');
  },
  updateDatasetPage: function (datasetObj) {
    // Store the new page and filter info in the project metadata
    let datasets = this.getMeta('datasets');
    let dataSpec = datasets.find(d => d.dataset === datasetObj.getId());
    dataSpec.page = datasetObj.cache.page;
    dataSpec.filter = datasetObj.cache.filter;
    this.setMeta('datasets', datasets);
    return this.checkAndSaveMatchings(['rl:changeDatasets']);
  },
  removeDataset: function (index = 0) {
    let datasets = this.getMeta('datasets');
    datasets.splice(index, 1);
    this.setMeta('datasets', datasets);
    this.cache.loadedDatasets = null;
    return this.checkAndSaveMatchings(['rl:changeDatasets']);
  },
  setDataset: function (newDatasetId, index = 0) {
    let datasets = this.getMeta('datasets');

    let newDatasetDetails = {
      dataset: newDatasetId
    };

    if (index >= datasets.length) {
      datasets.push(newDatasetDetails);
    } else {
      datasets[index] = newDatasetDetails;
    }
    this.setMeta('datasets', datasets);
    this.cache.loadedDatasets = null;
    return this.checkAndSaveMatchings(['rl:changeDatasets']);
  },
  removeVisualization: function (index = 0) {
    let visualizations = this.getMeta('visualizations');
    visualizations.splice(index, 1);
    this.setMeta('visualizations', visualizations);
    return this.checkAndSaveMatchings(['rl:changeVisualizations']);
  },
  setVisualization: function (visName, index = 0) {
    let visualizations = this.getMeta('visualizations');
    let newVisualizatoinDetails = {
      'name': visName,
      'options': {}
    };

    if (index >= visualizations.length) {
      visualizations.push(newVisualizatoinDetails);
    } else {
      delete this.cache.visDatasetPromises[index];
      visualizations[index] = newVisualizatoinDetails;
    }
    this.setMeta('visualizations', visualizations);
    return this.checkAndSaveMatchings(['rl:changeVisualizations']);
  },
  getAssignedVisFields: function (index = 0) {
    let meta = this.getMeta();
    let visDetails = meta.visualizations[index];
    // Copy the non-field options that are stored in the metadata
    let options = {};

    // Add field options as defined by the matchings
    meta.matchings.forEach(matching => {
      if (matching.visIndex === index) {
        let candelaOptionSpec = candela.components[visDetails.name].options.find(spec => {
          return spec.name === matching.visAttribute;
        });
        if (!candelaOptionSpec) {
          window.mainPage.trigger('rl:error', new Error('Unknown candela option: ' +
            matching.visAttribute));
        }
        if (candelaOptionSpec.type === 'string_list') {
          if (!(matching.visAttribute in options)) {
            options[matching.visAttribute] = [];
          }
          options[matching.visAttribute].push(matching.dataAttribute);
        } else {
          options[matching.visAttribute] = matching.dataAttribute;
        }
      }
    });
    return options;
  },
  getVisOptions: function (index = 0) {
    let meta = this.getMeta();
    let visDetails = meta.visualizations[index];
    // Copy the non-field options that are stored in the metadata
    return Object.assign({}, this.getAssignedVisFields(index), visDetails.options || {});
  },
  shapeDataForVis: function (index = 0) {
    if (index in this.cache.visDatasetPromises) {
      return this.cache.visDatasetPromises[index];
    }

    let meta = this.getMeta();
    if (meta.datasets.length <= index) {
      // The indicated dataset isn't loaded yet...
      // send the visualization a temporary empty dataset instead
      return Promise.resolve([]);
    }

    // TODO: when candela supports multiple datasets, include
    // all the datasets that the visualization connects to
    return this.getDataset(0).then(datasetObj => {
      if (datasetObj === null) {
        return [];
      } else {
        this.cache.visDatasetPromises[index] = datasetObj.cache.schema.then(schema => {
          // Collect the attributes that are in use in this dataset,
          // and figure out what we're coercing those attributes to
          let fieldsInUse = {};
          meta.matchings.forEach(matching => {
            if (matching.visIndex === index && matching.dataIndex === 0) {
              fieldsInUse[matching.dataAttribute] = datasetObj
                .getAttributeType(schema, matching.dataAttribute);
            }
          });

          return datasetObj.cache.currentDataPage.then(data => {
            let coercedData = [];
            data.forEach(item => {
              let newItem = {};
              Object.keys(item).forEach(attrName => {
                if (attrName in fieldsInUse) {
                  newItem[attrName] = binUtils.coerceValue(
                    item[attrName], fieldsInUse[attrName]);
                }
              });
              coercedData.push(newItem);
            });
            return coercedData;
          });
        });
        return this.cache.visDatasetPromises[index];
      }
    });
  },
  checkAndSaveMatchings: function (triggers) {
    triggers = triggers || [];

    // Go through all the matchings and make sure that:
    // 1. The referenced dataset and visualization are still in this project
    // 2. The dataset and visualization still have the named attribute
    // 3. The data types are still compatible
    // 4. TODO: Other things we should check?
    // Trash any matchings that don't make sense anymore
    return this.save().then(() => {
      return this.cache.loadedDatasets;
    }).then(loadedDatasets => {
      let meta = this.getMeta();
      let indicesToTrash = [];
      for (let [index, matching] of meta.matchings.entries()) {
        if (meta.datasets.length <= matching.dataIndex ||
          meta.visualizations.length <= matching.visIndex) {
          indicesToTrash.push(index);
          continue;
        }

        let datasetSpec = meta.datasets[matching.dataIndex];
        if (!datasetSpec || !datasetSpec.dataset) {
          indicesToTrash.push(index);
          continue;
        }
        let datasetObj = loadedDatasets[datasetSpec.dataset];
        if (!datasetObj) {
          indicesToTrash.push(index);
          continue;
        }

        let dataType = datasetObj.getTypeSpec()
          .attributes[matching.dataAttribute];
        let visName = meta.visualizations[matching.visIndex].name;
        let visSpec = candela.components[visName].options
          .find(spec => spec.name === matching.visAttribute);

        if (!dataType || !visSpec || !visSpec.domain || !visSpec.domain.fieldTypes) {
          indicesToTrash.push(index);
          continue;
        }

        if (visSpec.domain.fieldTypes.indexOf(dataType) === -1) {
          indicesToTrash.push(index);
        }
      }

      for (let index of indicesToTrash.reverse()) {
        meta.matchings.splice(index, 1);
      }

      // If we deleted any invalid matchings, add the appropriate signal...
      if (indicesToTrash.length > 0) {
        if (triggers.indexOf('rl:changeMatchings') === -1) {
          triggers.push('rl:changeMatchings');
        }
      }

      if (triggers.indexOf('rl:changeMatchings') !== -1) {
        // Clear the shaped data that relied on the old matchings.
        // TODO: currently, reshaped chunks of data are indexed by dataset index
        // (always zero until we support multiple datasets). A good optimization
        // might be to hash caches differently (e.g. by page), and it may not
        // always be necessary to throw them all away when the matchings change.
        this.cache.visDatasetPromises = {};
      }

      this.setMeta(meta);
      return this.save();
    }).then(() => {
      triggers.forEach(t => {
        this.trigger(t);
      });
    });
  },
  addMatching: function (matching) {
    let meta = this.getMeta();

    // Figure out if the vis option allows multiple fields
    let visDetails = meta.visualizations[matching.visIndex];
    let candelaOptionSpec = candela.components[visDetails.name].options.find(spec => {
      return spec.name === matching.visAttribute;
    });
    if (!candelaOptionSpec) {
      window.mainPage.trigger('rl:error', new Error('Unknown candela option: ' +
        matching.visAttribute));
    }

    // If the vis option doesn't allow multiple fields,
    // remove any existing matchings for that vis option
    if (candelaOptionSpec.type !== 'string_list') {
      meta.matchings = meta.matchings.filter(m => {
        return m.visIndex !== matching.visIndex ||
          m.visAttribute !== matching.visAttribute;
      });
    }

    // Add the matching
    meta.matchings.push(matching);

    this.setMeta(meta);
    return this.checkAndSaveMatchings(['rl:changeMatchings']);
  },
  removeMatching: function (matching) {
    let matchings = this.getMeta('matchings');

    let index = matchings.findIndex((m, i) => {
      return matching.visIndex === m.visIndex &&
        matching.visAttribute === m.visAttribute &&
        matching.dataIndex === m.dataIndex &&
        matching.dataAttribute === m.dataAttribute;
    });
    if (index !== -1) {
      matchings.splice(index, 1);
      this.setMeta('matchings', matchings);
      return this.checkAndSaveMatchings(['rl:changeMatchings']);
    } else {
      return Promise.resolve();
    }
  },
  getAllWidgetSpecs: function () {
    // Construct a list of all the widgets that
    // this project needs
    let meta = this.getMeta();
    let result = [];

    if (!meta.datasets || meta.datasets.length === 0) {
      // If there aren't any datasets yet,
      // include a dummy, empty dataset widget
      result.push({
        widgetType: 'DatasetView',
        hashName: 'DatasetViewDummy',
        index: null,
        id: null
      });
    } else {
      // Add a widget for every dataset
      meta.datasets.forEach((id, i) => {
        result.push({
          widgetType: 'DatasetView',
          hashName: 'DatasetView' + i,
          index: i,
          id: id
        });
      });
    }
    // Add the matching widget
    result.push({
      widgetType: 'MatchingView',
      hashName: 'MatchingView'
    });

    if (!meta.visualizations || meta.visualizations.length === 0) {
      // If there aren't any visualizations yet,
      // include a dummy, empty visualization widget
      result.push({
        widgetType: 'VisualizationView',
        hashName: 'VisualizationViewDummy',
        index: null,
        id: null
      });
    } else {
      // Add a widget for every visualization
      meta.visualizations.forEach((spec, i) => {
        result.push({
          widgetType: 'VisualizationView',
          hashName: 'VisualizationView' + i,
          index: i,
          spec: spec
        });
      });
    }

    return result;
  },
  storePreferredWidgets: function () {
    // this.setMeta('preferredWidgets', window.mainPage.widgetPanels.expandedWidgets);
    // return this.save();
  }
});

export default Project;
