import Backbone from 'backbone';
import myTemplate from './template.html';
// import libImage from '../../../assets/images/library.svg';
// import candela from '../../../../../../dist/candela/candela.js';

let VisualizationLibrary = Backbone.View.extend({
  render: function () {
    let self = this;
    self.$el.html(myTemplate);
    
    // TODO: populate with available visualizations
    // (see issue #12)
    
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

module.exports = VisualizationLibrary;
