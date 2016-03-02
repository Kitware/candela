import Backbone from 'backbone';
import myTemplate from './template.html';
import candela from './../../../../../src';

let SingleVisualizationView = Backbone.View.extend({
  render: function () {
    let self = this;

    self.$el.html(myTemplate);

    self.vis = new candela.components.Scatter('.visualization', {
      data: [{
        x: 1,
        y: 1
      }, {
        x: 3,
        y: 8
      }]
    });
  }
});

module.exports = SingleVisualizationView;
