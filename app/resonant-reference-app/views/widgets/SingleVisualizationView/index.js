import d3 from 'd3';
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
    
    // Get the visualization in the toolchain (if there is one)
    let visSpec = window.toolchain.get('meta');
    if (visSpec) {
      visSpec = visSpec.visualizations;
      if (visSpec) {
        visSpec = visSpec[0];
      }
    }
    
    let name = visSpec ? visSpec['name'] : 'None selected';
    
    let handle = d3.select(self.getIndicatorSpan());
    
    handle.on('click', function () {
      window.layout.overlay.render('visualizationLibrary');
    });
    handle.text(name);
    
    let handleIcon = handle.selectAll('img').data([0]);
    handleIcon.enter().append('img');
    
    self.$el.html(myTemplate);
    
    if (visSpec) {
      handleIcon.attr('src', Widget.okayIcon);
      self.vis = new candela.components[visSpec.name]('.visualization', {
        data: [{
          x: 1,
          y: 1
        }, {
          x: 3,
          y: 8
        }]
      });
    } else {
      handleIcon.attr('src', Widget.warningIcon);
    }
  }
});

export default SingleVisualizationView;
