import Widget from '../Widget';
import myTemplate from './template.html';
import candela from '../../../../../src/candela';
import './style.css';

import infoTemplate from './infoTemplate.html';

let VisualizationView = Widget.extend({
  initialize: function () {
    Widget.prototype.initialize.apply(this, arguments);

    this.vis = null;
    
    this.friendlyName = 'Visualization';

    this.statusText.onclick = () => {
      window.mainPage.overlay.render('VisualizationLibrary');
    };
    this.statusText.title = 'Click to select a different visualization.';

    this.newInfo = true;
    this.icons.splice(0, 0, {
      src: () => {
        return this.newInfo ? Widget.newInfoIcon : Widget.infoIcon;
      },
      title: () => {
        return 'About this panel';
      },
      onclick: () => {
        this.renderInfoScreen();
      }
    });
    
    this.ok = null;
    this.icons.splice(0, 0, {
      src: () => {
        if (this.ok === null) {
          return Widget.spinnerIcon;
        } else if (this.ok === true) {
          return Widget.okayIcon;
        } else {
          return Widget.warningIcon;
        }
      },
      title: () => {
        if (this.ok === null) {
          return 'The visualization hasn\'t finished loading yet';
        } else if (this.ok === true) {
          return 'The visualization appears to be working';
        } else {
          return 'Something isn\'t quite right; click for details';
        }
      },
      onclick: () => {
        this.renderHelpScreen();
      }
    });

    this.listenTo(window.mainPage.toolchain, 'rra:changeVisualizations', this.renderNewVis);
    this.listenTo(window.mainPage.toolchain, 'rra:changeMappings', this.renderNewVis);
  },
  renderInfoScreen: function () {
    this.newInfo = false;
    this.renderIndicators();

    window.mainPage.overlay.render(infoTemplate);
  },
  renderHelpScreen: function () {
    let screen;
    if (this.ok === null) {
      screen = this.getErrorScreen(`
You have not chosen a visualization yet. Click 
<a onclick="window.mainPage.overlay.render('VisualizationLibrary')">
here</a> to choose one.`);
    } else if (this.ok === true) {
      screen = this.getSuccessScreen(`
The visualization appears to be functioning correctly.`);
    } else {
      let meta = window.mainPage.toolchain.get('meta');

      if (!meta || !meta.visualizations || !meta.visualizations[0]) {
        screen = this.getErrorScreen(`
You have not chosen a visualization yet. Click 
<a onclick="window.mainPage.overlay.render('VisualizationLibrary')">
here</a> to choose one.`);
      } else {
        // TODO: Auto-log unexpected errors
        screen = this.getErrorScreen(`
You encountered an error we didn't anticipate! Please report it
<a>here</a>.`);
      }
    }

    window.mainPage.overlay.render(screen);
  },
  renderNewVis: function () {
    // Get the visualization in the toolchain (if there is one)
    let visSpec = window.mainPage.toolchain.getMeta('visualizations');
    if (visSpec) {
      visSpec = visSpec[0];
    }
    
    this.$el.html(myTemplate);
    this.addedTemplate = true;
    
    this.vis = null;
    
    if (visSpec) {
      let options = window.mainPage.toolchain.getVisOptions();
      
      this.ok = null;
      this.statusText.text = 'Loading...';

      window.mainPage.toolchain.shapeDataForVis(data => {
        // Temporarily force the scrollbars, so
        // the view can account for the needed space
        options.data = data;
        this.$el.css('overflow', 'scroll');
        let targetDiv = '#' + this.spec.hashName + 'Container .visualization';
        this.vis = new candela.components[visSpec.name](targetDiv, options);
        this.vis.render();
        this.$el.css('overflow', '');

        this.ok = true;
        this.statusText.text = visSpec['name'];
        this.render();
      });
    } else {
      this.ok = false;
      this.vis = null;
      this.statusText.text = 'None selected';
    }
    
    this.render();
  },
  render: function () {
    if (!this.addedTemplate) {
      this.renderNewVis();
    }
    
    if (this.vis !== null) {
      this.vis.render();
    }
    
    this.renderIndicators();
  }
});

export default VisualizationView;
