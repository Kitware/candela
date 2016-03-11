import Widget from '../Widget';
import myTemplate from './template.html';
import candela from './../../../../../src';
import './style.css';

let SingleVisualizationView = Widget.extend({
  initialize: function () {
    let self = this;
    self.friendlyName = 'Visualization';
    self.hashName = 'singleVisualizationView';

    self.listenTo(window.toolchain, 'rra:changeVisualizations', self.render);
    self.listenTo(window.toolchain, 'rra:changeMappings', self.render);
  },
  handleStatusClick: function () {
    window.layout.overlay.render('visualizationLibrary');
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
    
    self.$el.html(myTemplate);
    
    if (visSpec) {
      let options = window.toolchain.getVisOptions();
      
      self.statusIcon = Widget.spinnerIcon;
      self.statusText = 'Loading...';
      self.renderStatus();
      
      window.toolchain.shapeDataForVis(function (data) {
        // Temporarily force the scrollbars, so
        // the view can account for the needed space
        self.$el.css('overflow', 'scroll');
        self.vis = new candela.components[visSpec.name]('.visualization',
                                                        data, options);
        self.vis.render();
        self.$el.css('overflow', '');
        
        self.statusIcon = Widget.okayIcon;
        self.statusText = visSpec['name'];
        self.renderStatus();
      });
    } else {
      self.statusIcon = Widget.warningIcon;
      self.statusText = 'None selected';
      self.renderStatus();
    }
  }
});

export default SingleVisualizationView;
