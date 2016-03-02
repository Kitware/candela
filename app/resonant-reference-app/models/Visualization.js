import Backbone from 'backbone';

let Visualization = Backbone.Model.extend({
  defaults: {
    name: 'Error: this model is abstract',
    attrs: {}
  }
});

module.exports = Visualization;
