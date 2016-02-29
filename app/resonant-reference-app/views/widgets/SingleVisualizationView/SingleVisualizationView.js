import Backbone from 'backbone';
import myTemplate from './template.html';
let candela = require('../../../../../dist/candela/candela.js');

let SingleVisualizationView = Backbone.View.extend({
  render: function () {
    let self = this;

    self.$el.html(myTemplate);

    /*self.vis = new candela.default.components.Scatter('.visualization', {
      data: [{
        x: 1,
        y: 1
      }, {
        x: 3,
        y: 8
      }]
    });*/
  }
});

module.exports = SingleVisualizationView;
