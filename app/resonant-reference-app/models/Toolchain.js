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
    let self = this;
    let meta = self.get('meta');
    if (!meta) {
      meta = {};
    }
    
    let DatasetCollection = Backbone.Collection.extend({
      model: Dataset
    });
    
    meta.visualizations = [];
    meta.matching = {};
    meta.datasets = new DatasetCollection();
    // Forward events from dataset changes
    self.listenTo(meta.datasets, 'rra:changeSpec', function () {
      self.trigger('rra:changeMappings');
    });
    
    self.set('meta', meta);
  },
  setToolchain: function (newMeta) {
    let self = this;
    // Swap in an entirely new set of datasets, visualizations,
    // and pre-baked mappings
    let meta = self.get('meta');
    meta.datasets.set(newMeta.datasets);
    meta.matching = newMeta.matching;
    meta.visualizations = newMeta.visualizations;
    self.set('meta', meta);
    self.trigger('rra:changeDatasets');
    self.trigger('rra:changeMappings');
    self.trigger('rra:changeVisualizations');
  },
  setDataset: function (newDataset, index = 0) {
    let self = this;
    let triggers;
    // Need to convert the raw Girder ItemModel
    // (when we add it to meta.datasets, it gets
    // auto-converted to our Dataset model)
    newDataset = newDataset.toJSON();
    
    let meta = self.get('meta');
    if (newDataset.exampleToolchain &&
        meta.visualizations.length === 0) {
      // The user is starting off with this dataset;
      // we want to load up the example visualization and
      // the matching that goes with it
      self.setToolchain(newDataset.exampleToolchain);
    } else {
      if (index > meta.datasets.length) {
        meta.datasets.push(newDataset);
        triggers = ['rra:changeDatasets'];
      } else {
        meta.datasets.add(newDataset, { at: index, merge: true });
        // Swapping in a new dataset invalidates the matching
        meta.matching = {};
        triggers = ['rra:changeDatasets',
                    'rra:changeMappings'];
      }
    }
    
    self.set('meta', meta);
    
    for (let trigger of triggers) {
      self.trigger(trigger);
    }
  },
  setVisualization: function (newVisualization, index = 0) {
    let self = this;
    let triggers = [];
    let meta = self.get('meta');
    if (newVisualization.exampleToolchain &&
        meta.datasets.length === 0) {
      // The user is starting off with this visualization;
      // we want to load up the example dataset and
      // the matching that goes with it
      self.setToolchain(newVisualization.exampleToolchain);
    } else {
      if (index > meta.visualizations.length) {
        meta.visualizations.push(newVisualization);
        triggers = ['rra:changeVisualizations'];
      } else {
        meta.visualizations[index] = newVisualization;
        // Swapping in a new dataset invalidates the matching
        meta.matching = {};
        triggers = ['rra:changeVisualizations',
                    'rra:changeMappings'];
      }
    }
    
    self.set('meta', meta);
    
    for (let trigger of triggers) {
      self.trigger(trigger);
    }
  }
});

export default Toolchain;
