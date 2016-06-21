import Underscore from 'underscore';
import MetadataItem from './MetadataItem';
import Dataset from './Dataset';
import {
  Set
}
from '../shims/SetOps.js';
let girder = window.girder;
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
  defaults: function () {
    return {
      name: 'Untitled Project',
      meta: {
        itemType: 'project',
        versionNumber: window.mainPage.versionNumber,
        datasets: [],
        matchings: [],
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

    this.listenTo(window.mainPage.currentUser, 'rl:login',
      this.updateStatus);
    this.listenTo(window.mainPage.currentUser, 'rl:logout',
      this.updateStatus);
    this.listenTo(window.mainPage, 'rl:changeProject',
      this.updateStatus);
    this.listenTo(this, 'rl:swapId', () => {
      this.updateStatus().then(() => {
        window.mainPage.trigger('rl:createProject');
      });
    });
    this.listenTo(window.mainPage.widgetPanels, 'rl:navigateWidgets',
      this.storePreferredWidgets);
  },
  updateStatus: Underscore.debounce(function (copyOnError) {
    let id = this.getId();

    // Look up where the project lives,
    // and whether the user can edit it

    if (id === undefined) {
      if (copyOnError) {
        this.makeCopy();
      } else {
        this.status = {
          editable: false,
          location: null
        };
        this.trigger('rl:changeStatus');
        return Promise.reject(new Error('Project has no ID'));
      }
    }
    let statusPromise = new Promise((resolve, reject) => {
      girder.restRequest({
        path: 'item/' + id + '/anonymousAccess/info',
        type: 'GET',
        error: reject
      }).done(resolve).error(reject);
    }).then((resp) => {
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
      this.trigger('rl:changeStatus');
    });

    // Load up any datasets that the project references
    let datasetSpecs = this.getMeta('datasets');
    let datasetPromises = [];

    datasetSpecs.forEach(datasetSpec => {
      datasetPromises.push(new Promise((resolve, reject) => {
        girder.restRequest({
          path: 'item/' + datasetSpec.dataset,
          type: 'GET',
          error: reject
        }).done(resolve).error(reject);
      }));
    });
    let allDatasetPromises = Promise.all(datasetPromises).catch(errorObj => {
      window.mainPage.trigger('rl:error', errorObj);
    }).then(respObjects => {
      if (!respObjects) {
        window.mainPage.trigger('rl:error',
          new Error('Could not access this project\'s dataset(s)'));
      } else {
        let loadedDatasets = {};
        respObjects.forEach((resp, index) => {
          if (resp._id in window.mainPage.loadedDatasets) {
            // We've already loaded this dataset; update its filter and
            // paging parameters
            let dataset = window.mainPage.loadedDatasets[resp._id];
            dataset.setFilter(datasetSpecs[index].filter);
            dataset.setPage(datasetSpecs[index].page);
            loadedDatasets[resp._id] = dataset;
          } else {
            // We haven't seen this dataset before; load it up
            let newDataset = new Dataset(resp, datasetSpecs[index].filter, datasetSpecs[index].page);
            this.listenTo(newDataset, 'rl:changeSpec', this.changeDataSpec);
            this.listenTo(newDataset, 'rl:swapId', this.swapDatasetId);
            loadedDatasets[resp._id] = newDataset;
          }
        });
        // Okay, now that we know the datasets that should be open. Clear out
        // any listeners that are attached to old ones so they can be garbage
        // collected
        for (let datasetId in Object.keys(window.mainPage.loadedDatasets)) {
          if (!(datasetId in loadedDatasets)) {
            window.mainPage.loadedDatasets[datasetId].stopListening();
          }
        }
        window.mainPage.loadedDatasets = loadedDatasets;
      }
      this.trigger('rl:changeDatasets');
    });

    return Promise.all([statusPromise, allDatasetPromises]);
  }, 300),
  makeCopy: function () {
    /*
    When something weird happens (e.g. the user is
    trying to edit a project that they don't have write
    access to, or the project is in an unexpected location),
    we want to make sure that the user's actions are still
    always saved. This function copies the current state of
    the project to either the user's Private directory, or
    to the public scratch space if the user is logged out
    */
    let _fail = function (err) {
      // If we can't even save a copy, something
      // is seriously wrong.
      window.mainPage.switchProject(null);
      window.mainPage.trigger('rl:error', err);
    };

    this.unset('_id');
    return this.create()
      .then(() => {
        // This copy is now "ours"
        window.mainPage.currentUser.preferences.claimProject();
        // Let everyone know about the new project
        window.mainPage.trigger('rl:createProject');
        return this.updateStatus();
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
  getFlatMeta: function () {
    /*
      For the same reason as getMeta, MetadataItem needs to be
      able to get a flattened copy of the metadata for
      JSON.stringification
    */

    let meta = this.getMeta() || {};
    let flatMeta = {};

    for (let key of Object.keys(meta)) {
      flatMeta[key] = meta[key];
      if (key === 'preferredWidgets' &&
        meta[key] instanceof Set) {
        flatMeta[key] = [...meta[key]];
      }
    }
    return flatMeta;
  },
  rename: function (newName) {
    this.set('name', newName);
    return this.save().then(() => {
      this.trigger('rl:rename');
    }).catch((errorObj) => {
      window.mainPage.trigger('rl:error', errorObj);
    });
  },
  getDatasetIds: function () {
    return this.getMeta('datasets').map(d => d.dataset);
  },
  swapDatasetId: function (newData) {
    let datasets = this.getMeta('datasets');
    let index = datasets.findIndex(d => d.dataset === newData._oldId);
    if (index !== -1 || !(newData._oldId in window.mainPage.loadedDatasets)) {
      // Update the project metadata to point to the new dataset
      datasets[index] = newData._id;
      this.setMeta('datasets', datasets);

      // Update the cached dataset key
      window.mainPage.loadedDatasets[newData._id] = window.mainPage.loadedDatasets[newData._oldId];
      delete window.mainPage.loadedDatasets[newData._oldId];
    } else {
      window.mainPage.trigger('rl:error',
        new Error('Encountered a problem handling a swapped dataset id'));
    }
  },
  setDataset: function (newDatasetId, index = 0) {
    let datasets = this.getMeta('datasets');
    let newDataset;

    if (newDatasetId in window.mainPage.loadedDatasets) {
      newDataset = window.mainPage.loadedDatasets[newDatasetId];
    } else {
      newDataset = new Dataset(newDatasetId);
      this.listenTo(newDataset, 'rl:changeSpec', this.changeDataSpec);
      this.listenTo(newDataset, 'rl:swapId', this.swapDatasetId);
      window.mainPage.loadedDatasets[newDatasetId] = newDataset;
    }

    let newDatasetDetails = {
      dataset: newDatasetId,
      filter: newDataset.filter,
      page: newDataset.page
    };

    if (index >= datasets.length) {
      datasets.push(newDatasetDetails);
    } else {
      datasets[index] = newDatasetDetails;
    }
    this.setMeta('datasets', datasets);
    return this.save().then(() => {
      this.trigger('rl:changeDatasets');
      return this.validateMatchings();
    }).catch((errorObj) => {
      window.mainPage.trigger('rl:error', errorObj);
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
      this.trigger('rl:changeVisualizations');
      this.validateMatchings();
    }).catch((errorObj) => {
      window.mainPage.trigger('rl:error', errorObj);
    });
  },
  shapeDataForVis: function (index = 0) {
    let meta = this.getMeta();

    let datasetId = meta.datasets[0];
    if (!window.mainPage.loadedDatasets[datasetId]) {
      return Promise.resolve([]);
    } else {
      // Use the matching to transform
      // the parsed data into the shape
      // that the visualization expects
      return window.mainPage.loadedDatasets[datasetId].parse();
    }
  },
  getVisOptions: function (index = 0) {
    let meta = this.getMeta();
    let options = {};

    // Figure out which options allow multiple fields
    meta.matchings.forEach(matching => {
      for (let optionSpec of meta.visualizations[matching.visIndex].options) {
        if (optionSpec.name === matching.visAttribute) {
          if (optionSpec.type === 'string_list') {
            options[matching.visAttribute] = [];
          }
          break;
        }
      }
    });

    // Construct the options
    meta.matchings.forEach(matching => {
      if (Array.isArray(options[matching.visAttribute])) {
        options[matching.visAttribute].push(matching.dataAttribute);
      } else {
        options[matching.visAttribute] = matching.dataAttribute;
      }
    });
    return options;
  },
  changeDataSpec: function () {
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

      let dataset = window.mainPage.loadedDatasets[meta.datasets[matching.dataIndex]];
      if (!dataset) {
        indicesToTrash.push(index);
        continue;
      }

      let dataType = dataset.getSpec()
        .attributes[matching.dataAttribute];
      let optionSpec = meta.visualizations[matching.visIndex]
        .options.find(spec => spec.name === matching.visAttribute);

      if (!dataType || !optionSpec) {
        indicesToTrash.push(index);
        continue;
      }

      if (optionSpec.domain.fieldTypes.indexOf(dataType) === -1) {
        indicesToTrash.push(index);
      }
    }

    for (let index of indicesToTrash.reverse()) {
      meta.matchings.splice(index, 1);
    }

    this.setMeta(meta);
    return this.save().then(() => {
      this.trigger('rl:changeMatchings');
    }).catch(errorObj => {
      window.mainPage.trigger('rl:error', errorObj);
    });
  },
  addMatching: function (matching) {
    let meta = this.getMeta();

    // Figure out if the vis option allows multiple fields
    let optionSpec = meta.visualizations[matching.visIndex]
      .options.find(spec => spec.name === matching.visAttribute);

    // If the vis option doesn't allow multiple fields,
    // remove any existing matchings for that vis option
    if (optionSpec.type !== 'string_list') {
      meta.matchings = meta.matchings.filter(m => {
        return m.visIndex !== matching.visIndex ||
          m.visAttribute !== matching.visAttribute;
      });
    }

    // Add the matching
    meta.matchings.push(matching);

    this.setMeta(meta);
    this.save().then(() => {
      this.trigger('rl:changeMatchings');
    }).catch(errorObj => {
      window.mainPage.trigger('rl:error', errorObj);
    });
  },
  removeMatching: function (matching) {
    let matchings = this.getMeta('matchings');

    let index;
    let temp = matchings.find((m, i) => {
      index = i;
      return matching.visIndex === m.visIndex &&
        matching.visAttribute === m.visAttribute &&
        matching.dataIndex === m.dataIndex &&
        matching.dataAttribute === m.dataAttribute;
    });
    if (temp) {
      matchings.splice(index, 1);
    }
    this.setMeta('matchings', matchings);
    this.save().then(() => {
      this.trigger('rl:changeMatchings');
    }).catch(errorObj => {
      window.mainPage.trigger('rl:error', errorObj);
    });
  },
  getAllWidgetSpecs: function () {
    // Construct a list of all the widgets that
    // this project needs
    let meta = this.getMeta();
    let result = [];

    meta.datasets.forEach((id, i) => {
      result.push({
        widgetType: 'DatasetView',
        hashName: 'DatasetView' + i,
        index: i,
        id: id
      });
    });
    result.push({
      widgetType: 'MatchingView',
      hashName: 'MatchingView'
    });
    meta.visualizations.forEach((spec, i) => {
      result.push({
        widgetType: 'VisualizationView',
        hashName: 'VisualizationView' + i,
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

export default Project;
