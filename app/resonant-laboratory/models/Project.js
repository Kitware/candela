import MetadataItem from './MetadataItem';
import Dataset from './Dataset';
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
  defaults: {
    'name': 'Untitled Project',
    'meta': {
      'rlab': {
        datasets: [],
        matchings: [],
        visualizations: [],
        preferredWidgets: []
      }
    }
  },
  initialize: function () {
    this.status = {
      editable: false,
      location: null
    };

    this.listenTo(window.mainPage.currentUser, 'rl:login',
      this.fetch);
    this.listenTo(window.mainPage.currentUser, 'rl:logout',
      this.fetch);
    this.listenTo(window.mainPage, 'rl:changeProject',
      this.fetch);
    this.listenTo(this, 'rl:swapId', () => {
      this.fetch().then(() => {
        window.mainPage.trigger('rl:createProject');
      });
    });
    this.listenTo(window.mainPage.widgetPanels, 'rl:navigateWidgets',
      this.storePreferredWidgets);
  },
  create: function () {
    let createPromise = MetadataItem.prototype.create.apply(this, arguments);
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
    fetchPromise.then(() => {
      return this.restRequest({
        path: 'anonymousAccess/info',
        type: 'GET'
      }).then(resp => {
        this.status = resp;
        this.trigger('rl:changeStatus');
      });
    });

    // Calling fetch() on a project should also call trigger
    // fetch() on all the project's datasets (and update which
    // ones are stored in window.mainPage.loadedDatasets)
    fetchPromise.then(() => {
      let datasetPromises = [];
      let newLoadedDatasets = {};
      let datasetSpecs = this.getMeta('datasets');
      datasetSpecs.forEach((datasetSpec, index) => {
        let dataset;
        if (datasetSpec.dataset in window.mainPage.loadedDatasets) {
          // We've already loaded this dataset; update its filter and
          // paging parameters
          dataset = window.mainPage.loadedDatasets[datasetSpec.dataset];
          dataset.setFilter(datasetSpecs[index].filter);
          dataset.setPage(datasetSpecs[index].page);
        } else {
          // We haven't loaded this dataset yet; load it and
          // attach some listeners
          dataset = new Dataset({
            id: datasetSpec.dataset
          }, datasetSpecs[index].filter,
             datasetSpecs[index].page);
          this.listenTo(dataset, 'rl:changeSpec', this.changeDataSpec);
          this.listenTo(dataset, 'rl:swapId', this.swapDatasetId);
        }
        newLoadedDatasets[datasetSpec.dataset] = dataset;
        datasetPromises.push(newLoadedDatasets[datasetSpec.dataset]).fetch();
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

    return fetchPromise;
  }, 100),
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
        new Error('Couldn\'t update the reference to a scratch copy of a dataset.'));
    }
    return this.save();
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
  shapeDataForVis: function (index = 0) {
    let meta = this.getMeta();
    if (meta.datasets.length < index) {
      // The indicated dataset isn't loaded yet...
      // send the visualization a temporary empty dataset instead
      return Promise.resolve([]);
    }

    let datasetId = meta.datasets[0];
    // TODO: when candela supports multiple datasets, include
    // all the datasets that the visualization connects to
    // TODO: potential optimization: use the set of relevant fields
    // to retrieve less data in the call to dataset/getData in
    // Dataset.fetch()
    return window.mainPage.loadedDatasets[datasetId].loadPage();
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

    if (indicesToTrash.length > 0) {
      this.setMeta(meta);
      return this.save().then(() => {
        this.trigger('rl:changeMatchings');
      });
    } else {
      return Promise.resolve();
    }
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
