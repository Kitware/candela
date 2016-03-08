import Backbone from 'backbone';
import Dataset from './Dataset';
let girder = window.girder;

/*
    A Toolchain represents a user's saved session;
    it includes specific datasets, with specific
    matchings to specific visualizations (in the future,
    this may also include faceting settings, etc).
    
    Though behind the scenes we're making room for multiple
    datasets and multiple visualizations,
    for now, toolchains are expected to only contain one
    dataset and one visualization. Any more are ignored
    by the currently implemented views.
    
    Also, while we're extending a Girder ItemModel
    (we intend toolchains to be saved as files eventually,
    we're not using any Girder functionality yet)
*/

let Toolchain = girder.models.ItemModel.extend({
  initialize: function () {
    let meta = this.get('meta');
    if (!meta) {
      meta = {};
    }
    
    meta.datasets = Backbone.Collection.extend({
      model: Dataset
    });
    meta.visualizations = [];
    meta.matching = {};
    
    this.set('meta', meta);
  },
  setDataset: function (newDataset, index = 0) {
    let triggers = [];
    // Sneaky hack to cast the raw Girder ItemModel
    // into our Dataset subclass
    newDataset = new Dataset(newDataset.toJson());
    
    let meta = this.get('meta');
    if (newDataset.has('exampleToolchain') &&
        meta.visualizations.length === 0) {
      // The user is starting off with this dataset;
      // we want to load up the example visualization and
      // matching that go with it
      meta = newDataset.get('exampleToolchain');
    } else {
      if (index > meta.datasets.length) {
        meta.datasets.push(newDataset);
        triggers.push('rra:changeDatasets');
      } else {
        meta.datasets[index] = newDataset;
        triggers.push('rra:changeDatasets');
        // Swapping in a new dataset invalidates the matching
        meta.matching = {};
        triggers.push('rra:changeMatchings');
      }
    }
    
    this.set('meta', meta);
    
    for (let trigger of triggers) {
      this.trigger(trigger);
    }
  },
  setVisualization: function (newVisualization, index = 0) {
    let triggers = [];
    let meta = this.get('meta');
    if (newVisualization.has('exampleToolchain') &&
        meta.datasets.length === 0) {
      // The user is starting off with this visualization;
      // we want to load up the example dataset and
      // matching that go with it
      meta = newVisualization.get('exampleToolchain');
    } else {
      if (index > meta.visualizations.length) {
        meta.visualizations.push(newVisualization);
        triggers.push('rra:changeVisualizations');
      } else {
        meta.visualizations[index] = newVisualization;
        triggers.push('rra:changeVisualizations');
        // Swapping in a new dataset invalidates the matching
        meta.matching = {};
        triggers.push('rra:changeMatchings');
      }
    }
    
    this.set('meta', meta);
    
    for (let trigger of triggers) {
      this.trigger(trigger);
    }
  },
  pipeDataForVis: function (callback, visIndex) {
    let meta = this.get('meta');
    if (!visIndex) {
      visIndex = 0;
    }
    
    // TODO: use the matching to transform
    // the parsed data into the shape that
    // the visualization expects
    
    meta.datasets[0].getParsed(function (data) {
      callback(data);
    });
  }
});

export default Toolchain;
