import Backbone from 'backbone';
import Dataset from './dataset.js';
import Visualization from './visualization.js';
import Matching from './matching.js';

let Datasets = Backbone.Collection.extend({
  model: Dataset
});

let Visualizations = Backbone.Collection.extend({
  model: Visualization
});

/*
    A Toolchain represents a user's saved session;
    it includes specific datasets, with specific
    matchings to specific visualizations (in the future,
    this may also include faceting settings).
    
    Though behind the scenes we're making room for multiple
    datasets and multiple visualizations,
    for now, toolchains are expected to only contain one
    dataset and one visualization. Any more are ignored
    by the currently implemented views.
*/

let Toolchain = Backbone.Model.extend({
  defaults: {
    datasets: new Datasets(),
    visualizations: new Visualizations(),
    matching: new Matching()
  },
  set: function (attributes, options) {
    /*
        This will almost always be called by
        functions without access to our local
        Datasets and Visualizations collections,
        so we wrap them up here
    */
    if (attributes.datasets !== undefined &&
      !(attributes.datasets instanceof Datasets)) {
      attributes.datasets = new Datasets(attributes.datasets);
    }
    if (attributes.visualizations !== undefined &&
      !(attributes.visualizations instanceof Visualizations)) {
      attributes.visualizations = new Visualizations(attributes.visualizations);
    }
    return Backbone.Model.prototype.set.call(this, attributes, options);
  }
});

module.exports = Toolchain;
