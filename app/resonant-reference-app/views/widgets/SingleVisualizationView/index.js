import Widget from '../Widget';
import myTemplate from './template.html';
import candela from './../../../../../src';

let SingleVisualizationView = Widget.extend({
  initialize: function () {
    let self = this;
    self.friendlyName = 'Visualization';
    self.hashName = 'singleVisualizationView';
    
    self.listenTo(window.toolchain, 'rra:changeVisualizations', self.render);
  },
  render: function () {
    let self = this;
    self.$el.html(myTemplate);
    
    let meta = window.toolchain.get('meta');
    let visSpec = meta.visualizations;
    if (visSpec) {
      visSpec = visSpec[0];
    }
    if (visSpec) {
      self.vis = new candela.components[visSpec.name]('.visualization', {
        data: [{
          x: 1,
          y: 1
        }, {
          x: 3,
          y: 8
        }]
      });
    }
  }
});

export default SingleVisualizationView;
