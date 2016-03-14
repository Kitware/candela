import Widget from '../Widget';
import myTemplate from './template.html';
import candela from './../../../../../src';
import './style.css';

let SingleVisualizationView = Widget.extend({
  initialize: function (options) {
    let self = this;
    Widget.prototype.initialize.apply(self, options);
    
    self.friendlyName = 'Visualization';
    self.hashName = 'singleVisualizationView';
    self.statusText.onclick = function () {
      window.layout.overlay.render('visualizationLibrary');
    };

    self.listenTo(window.toolchain, 'rra:changeVisualizations', self.render);
    self.listenTo(window.toolchain, 'rra:changeMappings', self.render);
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
      
      // self.statusIcon = Widget.spinnerIcon;
      self.statusText.text = 'Loading...';
      self.renderIndicators();
      
      window.toolchain.shapeDataForVis(function (data) {
        // Temporarily force the scrollbars, so
        // the view can account for the needed space
        self.$el.css('overflow', 'scroll');
        self.vis = new candela.components[visSpec.name]('.visualization',
                                                        data, options);
        self.vis.render();
        self.$el.css('overflow', '');
        
        // self.statusIcon = Widget.okayIcon;
        self.statusText.text = visSpec['name'];
        self.renderIndicators();
      });
    } else {
      // self.statusIcon = Widget.warningIcon;
      self.statusText.text = 'None selected';
      self.renderIndicators();
    }
  }
});

export default SingleVisualizationView;
