import Widget from '../Widget';
import myTemplate from './template.html';
import candela from '../../../../../src/candela';
import './style.css';

import infoTemplate from './infoTemplate.html';

let VisualizationView = Widget.extend({
  initialize: function (options) {
    let self = this;
    Widget.prototype.initialize.apply(self, options);

    self.friendlyName = 'Visualization';
    self.hashName = 'VisualizationView';

    self.statusText.onclick = function () {
      window.mainPage.overlay.render('VisualizationLibrary');
    };
    self.statusText.title = 'Click to select a different visualization.';

    self.newInfo = true;
    self.icons.splice(0, 0, {
      src: function () {
        return self.newInfo ? Widget.newInfoIcon : Widget.infoIcon;
      },
      title: function () {
        return 'About this panel';
      },
      onclick: function () {
        self.renderInfoScreen();
      }
    });

    self.ok = null;
    self.icons.splice(0, 0, {
      src: function () {
        if (self.ok === null) {
          return Widget.spinnerIcon;
        } else if (self.ok === true) {
          return Widget.okayIcon;
        } else {
          return Widget.warningIcon;
        }
      },
      title: function () {
        if (self.ok === null) {
          return 'The visualization hasn\'t finished loading yet';
        } else if (self.ok === true) {
          return 'The visualization appears to be working';
        } else {
          return 'Something isn\'t quite right; click for details';
        }
      },
      onclick: function () {
        self.renderHelpScreen();
      }
    });

    self.listenTo(window.mainPage.toolchain, 'rra:changeVisualizations', self.render);
    self.listenTo(window.mainPage.toolchain, 'rra:changeMappings', self.render);
  },
  renderInfoScreen: function () {
    let self = this;
    self.newInfo = false;
    self.renderIndicators();

    window.mainPage.overlay.render(infoTemplate);
  },
  renderHelpScreen: function () {
    let self = this;
    let screen;
    if (self.ok === null) {
      screen = self.getErrorScreen(`
You have not chosen a visualization yet. Click 
<a onclick="window.mainPage.overlay.render('VisualizationLibrary')">
here</a> to choose one.`);
    } else if (self.ok === true) {
      screen = self.getSuccessScreen(`
The visualization appears to be functioning correctly.`);
    } else {
      let meta = window.mainPage.toolchain.get('meta');

      if (!meta || !meta.visualizations || !meta.visualizations[0]) {
        screen = self.getErrorScreen(`
You have not chosen a visualization yet. Click 
<a onclick="window.mainPage.overlay.render('VisualizationLibrary')">
here</a> to choose one.`);
      } else {
        // TODO: Auto-log unexpected errors
        screen = self.getErrorScreen(`
You encountered an error we didn't anticipate! Please report it
<a>here</a>.`);
      }
    }

    window.mainPage.overlay.render(screen);
  },
  render: function () {
    let self = this;

    // Get the visualization in the toolchain (if there is one)
    let visSpec = window.mainPage.toolchain.getMeta('visualizations');
    if (visSpec) {
      visSpec = visSpec[0];
    }

    self.$el.html(myTemplate);

    if (visSpec) {
      let options = window.mainPage.toolchain.getVisOptions();

      self.ok = null;
      self.statusText.text = 'Loading...';
      self.renderIndicators();

      window.mainPage.toolchain.shapeDataForVis(function (data) {
        // Temporarily force the scrollbars, so
        // the view can account for the needed space
        options.data = data;
        self.$el.css('overflow', 'scroll');
        self.vis = new candela.components[visSpec.name]('.visualization',
                                                        options);
        self.vis.render();
        self.$el.css('overflow', '');

        self.ok = true;
        self.statusText.text = visSpec['name'];
        self.renderIndicators();
      });
    } else {
      self.ok = false;
      self.statusText.text = 'None selected';
      self.renderIndicators();
    }
  }
});

export default VisualizationView;
