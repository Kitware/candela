import Underscore from 'underscore';
import MetadataItem from './MetadataItem';
import Dataset from './Dataset';
import binUtils from '../general_purpose/binUtils.js';
import promiseDebounce from '../shims/promiseDebounce.js';
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
    this.status = {
      editable: false,
      visibility: null,
      path: null
    };

    this.visDatasetPromises = {};

    this.listenTo(window.mainPage.currentUser, 'rl:login',
      this.fetch);
    this.listenTo(window.mainPage.currentUser, 'rl:logout',
      this.fetch);
    this.listenTo(window.mainPage, 'rl:changeProject',
      this.fetch);
    this.listenTo(this, 'rl:swappedId', () => {
      // If the server makes a copy of this project
      // for whatever reason, there's a good chance
      // it will wind up with a different location /
      // editability status. So we need to update the
      // status, and it's essentially the same thing
      // as creating a new project
      this.fetch().then(() => {
        let notification = 'You are now working on a copy of this project in ';
        if (this.status.visibility === 'PublicScratch') {
          notification = 'the public scratch space. Log in to take ownership of this project.';
        } else if (this.status.visibility === 'PrivateUser') {
          notification += 'your Private folder.';
        } else {
          window.mainPage.trigger('rl:error', new Error('Project copied to an unknown location.'));
        }
        window.mainPage.notificationLayer.displayNotification(notification);
        window.mainPage.trigger('rl:createProject');
      });
    });
    this.listenTo(window.mainPage.widgetPanels, 'rl:navigateWidgets',
      this.storePreferredWidgets);
    this.listenTo(this, 'rl:changeDatasets', this.clearCoercedData);
    this.listenTo(this, 'rl:changeMatchings', this.clearCoercedData);
  },
  create: function () {
    let createPromise = MetadataItem.prototype.create.apply(this, arguments);
    createPromise.then(() => {
      // Hit the endpoint that identifies the item as a project
      return this.restRequest({
        path: 'project',
        method: 'POST'
      }).then(resp => {
        this.set(resp);
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
  fetch: promiseDebounce(function () {
    let fetchPromise = MetadataItem.prototype.fetch.apply(this, arguments);

    // Whenever we update the project metadata, we also want
    // to update the information about where the project is stored
    // and whether the user can edit it
    let statusPromise = fetchPromise.then(() => {
      return this.restRequest({
        path: 'anonymousAccess/info',
        type: 'GET'
      }).then(resp => {
        this.status = resp;
        this.trigger('rl:changeStatus');
      });
    });

    // Calling fetch() on a project should also call
    // fetch() on all the project's datasets (and update which
    // ones are stored in window.mainPage.loadedDatasets)
    let datasetsPromise = fetchPromise.then(() => {
      let datasetPromises = [];
      let newLoadedDatasets = {};
      let datasetSpecs = this.getMeta('datasets');
      datasetSpecs.forEach((datasetSpec, index) => {
        let dataset;
        if (datasetSpec.dataset in window.mainPage.loadedDatasets) {
          // We've already loaded this dataset; update its filter and
          // paging parameters
          dataset = window.mainPage.loadedDatasets[datasetSpec.dataset];
        } else {
          // We haven't loaded this dataset yet; load it and
          // attach some listeners
          dataset = new Dataset({
            _id: datasetSpec.dataset
          });
          this.listenTo(dataset, 'rl:updatedSchema', this.updateDataSpec);
          this.listenTo(dataset, 'rl:swappedId', oldId => {
            this.swapDatasetId(dataset, oldId);
          });
          this.listenTo(dataset, 'rl:updatePage', () => {
            this.updateDatasetPage(dataset);
          });
        }
        if (datasetSpec.filter) {
          dataset.cache.filter = datasetSpec.filter;
        }
        if (datasetSpec.page) {
          dataset.cache.page = datasetSpec.page;
        }
        newLoadedDatasets[datasetSpec.dataset] = dataset;
        datasetPromises.push(newLoadedDatasets[datasetSpec.dataset].fetch());
      });
      // Now go through and discard any references to
      // old datasets that we don't need anymore
      Object.keys(window.mainPage.loadedDatasets).forEach(datasetId => {
        if (!(datasetId in newLoadedDatasets)) {
          // Flag this dataset as one that isn't being used anymore
          // in case anyone (e.g. a view) is still holding a reference
          // to it, so that we don't accidentally try to save anything
          // about it anymore
          window.mainPage.loadedDatasets[datasetId].dropped = true;
          window.mainPage.loadedDatasets[datasetId].stopListening();
        }
      });
      window.mainPage.loadedDatasets = newLoadedDatasets;
      return Promise.all(datasetPromises).then(() => {
        this.trigger('rl:changeDatasets');
      });
    });

    // Though we only return the main fetch response, the fetch isn't
    // complete until the status and dataset promises have been resolved
    return Promise.all([fetchPromise, statusPromise, datasetsPromise])
      .then(responses => {
        return responses[0];
      });
  }, 100),
  save: function () {
    // Prevent any lingering attempts to save the
    // project once the project has been closed
    if (window.mainPage.project === null) {
      return Promise.resolve(null);
    } else {
      return MetadataItem.prototype.save.apply(this, arguments);
    }
  },
  rename: function () {
    // Renaming the project should trigger a fetch()
    // so that the project's status gets updated
    return MetadataItem.prototype.rename.apply(this, arguments)
      .then(() => {
        return this.fetch();
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
  getDataset: function (index) {
    let datasets = window.mainPage.project.getMeta('datasets');
    if (datasets && datasets.length > 0) {
      return window.mainPage.loadedDatasets[datasets[0].dataset];
    } else {
      return undefined;
    }
  },
  getDatasetIds: function () {
    return (this.getMeta('datasets') || []).map(d => d.dataset);
  },
  swapDatasetId: function (datasetObj, oldId) {
    let newId = datasetObj.getId();
    if (newId in window.mainPage.loadedDatasets) {
      // Another response from the server has already triggered this function
      // and dealt with everything, so we don't have to worry about it.
      return;
    } else {
      // Okay, this dataset has been moved, and we're the first to
      // know about it.

      // Update the projet metadata and the loadedDatasets cache
      // to point to the new dataset
      let datasets = this.getMeta('datasets');
      let index = datasets.findIndex(d => d.dataset === oldId);
      if (index !== -1 && oldId in window.mainPage.loadedDatasets) {
        datasets[index] = {
          dataset: newId,
          filter: datasetObj.cache.filter,
          page: datasetObj.cache.page
        };
        this.setMeta('datasets', datasets);
        this.save();

        window.mainPage.loadedDatasets[newId] = datasetObj;
        delete window.mainPage.loadedDatasets[oldId];

        // If the user is logged in, the dataset will have been copied
        // to the user's private folder
        let notification = 'You are now working with a copy of the ' +
                           datasetObj.get('name') +
                           ' dataset, stored in ';
        if (window.mainPage.currentUser.isLoggedIn()) {
          notification += 'your Private folder.';
        } else {
          notification += 'the public scratch space. Log in to take ownership of this dataset.';
        }
        window.mainPage.notificationLayer.displayNotification(notification);
      } else {
        window.mainPage.trigger('rl:error',
          new Error('Couldn\'t update the reference to a scratch copy of the ' +
                    datasetObj.get('name') + ' dataset.'));
      }
    }
  },
  updateDatasetPage: Underscore.debounce(function (datasetObj) {
    // Store the new page and filter info in the project metadata
    let datasets = this.getMeta('datasets');
    let dataSpec = datasets.find(d => d.dataset === datasetObj.getId());
    dataSpec.page = datasetObj.cache.page;
    dataSpec.filter = datasetObj.cache.filter;
    this.setMeta('datasets', datasets);
    this.save();
    // Forward the event at the project level
    this.trigger('rl:changeDatasets');
  }, 50),
  removeDataset: function (index = 0) {
    let datasets = this.getMeta('datasets');
    datasets.splice(index, 1);
    this.setMeta('datasets', datasets);
    return this.save().then(() => {
      this.trigger('rl:changeDatasets');
      return this.validateMatchings();
    });
  },
  setDataset: function (newDatasetId, index = 0) {
    let datasets = this.getMeta('datasets');
    let newDataset;

    let promises = [];

    if (newDatasetId in window.mainPage.loadedDatasets) {
      newDataset = window.mainPage.loadedDatasets[newDatasetId];
      promises.push(Promise.resolve(newDataset));
    } else {
      newDataset = new Dataset({
        _id: newDatasetId
      });
      this.listenTo(newDataset, 'rl:updatedSchema', this.updateDataSpec);
      this.listenTo(newDataset, 'rl:swappedId', oldId => {
        this.swapDatasetId(newDataset, oldId);
      });
      this.listenTo(newDataset, 'rl:updatePage', () => {
        this.updateDatasetPage(newDataset);
      });
      window.mainPage.loadedDatasets[newDatasetId] = newDataset;
      promises.push(newDataset.fetch());
    }

    let newDatasetDetails = {
      dataset: newDatasetId,
      filter: newDataset.cache.filter,
      page: newDataset.cache.page
    };

    if (index >= datasets.length) {
      datasets.push(newDatasetDetails);
    } else {
      datasets[index] = newDatasetDetails;
    }
    this.setMeta('datasets', datasets);
    promises.push(this.save().then(() => {
      this.trigger('rl:changeDatasets');
      return this.validateMatchings();
    }));
    return Promise.all(promises);
  },
  removeVisualization: function (index = 0) {
    let visualizations = this.getMeta('visualizations');
    visualizations.splice(index, 1);
    this.setMeta('visualizations', visualizations);
    return this.save().then(() => {
      this.trigger('rl:changeVisualizations');
      return this.validateMatchings();
    });
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
      delete this.visDatasetPromises[index];
      visualizations[index] = newVisualizatoinDetails;
    }
    this.setMeta('visualizations', visualizations);
    return this.save().then(() => {
      this.trigger('rl:changeVisualizations');
      return this.validateMatchings();
    });
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
  clearCoercedData: function () {
    // Invalidate our coerced dataset caches (TODO: may not
    // be necessary to invalidate all of them)
    this.visDatasetPromises = {};
  },
  shapeDataForVis: function (index = 0) {
    if (index in this.visDatasetPromises) {
      return this.visDatasetPromises[index];
    }

    let meta = this.getMeta();
    if (meta.datasets.length <= index) {
      // The indicated dataset isn't loaded yet...
      // send the visualization a temporary empty dataset instead
      return Promise.resolve([]);
    }

    let datasetObj = this.getDataset(0);
    // TODO: when candela supports multiple datasets, include
    // all the datasets that the visualization connects to

    this.visDatasetPromises[index] = datasetObj.cache.schema.then(schema => {
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
    return this.visDatasetPromises[index];
  },
  updateDataSpec: function () {
    return this.validateMatchings().then(() => {
      this.trigger('rl:changeDatasets');
    });
  },
  validateMatchings: function () {
    let meta = this.getMeta();

    // Go through all the matchings and make sure that:
    // 1. The referenced dataset and visualization
    //    are still in this project
    // 2. The dataset and visualization still have
    //    the named attribute
    // 3. The data types are still compatible
    // 4. TODO: Other things we should check?
    // Trash any matchings that don't make sense anymore
    let indicesToTrash = [];
    for (let [index, matching] of meta.matchings.entries()) {
      if (meta.datasets.length <= matching.dataIndex ||
        meta.visualizations.length <= matching.visIndex) {
        indicesToTrash.push(index);
        continue;
      }

      let dataset = this.getDataset(matching.dataIndex);
      if (!dataset) {
        indicesToTrash.push(index);
        continue;
      }

      let dataType = dataset.getTypeSpec()
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

    this.setMeta(meta);
    return this.save().then(() => {
      this.trigger('rl:changeMatchings');
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
    return this.save().then(() => {
      this.trigger('rl:changeMatchings');
    });
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
      return this.save().then(() => {
        this.trigger('rl:changeMatchings');
      });
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
    this.setMeta('preferredWidgets',
      window.mainPage.widgetPanels.expandedWidgets);
    return this.save();
  }
});

export default Project;
