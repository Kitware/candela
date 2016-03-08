import Widget from '../Widget';
import myTemplate from './template.html';
import candela from './../../../../../src';

let SingleVisualizationView = Widget.extend({
  initialize: function () {
    let self = this;
    self.friendlyName = 'Visualization';
    self.hashName = 'singleVisualizationView';
  },
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

export default SingleVisualizationView;
