import jQuery from 'jquery';

// Page-wide Styles
import './stylesheets/pure-css-custom-form-elements/style.css';
import './stylesheets/tooltip/tooltip.css';
import './stylesheets/mainPage.css';

// Current toolchain
// TODO: Save/load these as files
import Toolchain from './models/Toolchain';
window.toolchain = new Toolchain();

// Currently visible widgets
// TODO: Add to the set of widgets on
// screen per the user's skill level
// and preferences
import SingleDatasetView from './views/widgets/SingleDatasetView';
import MappingView from './views/widgets/MappingView';
import SingleVisualizationView from './views/widgets/SingleVisualizationView';
window.widgets = [
  new SingleDatasetView(),
  new MappingView(),
  new SingleVisualizationView()
];

// The overlay views
import StartingGuide from './views/overlays/StartingGuide';
import DatasetLibrary from './views/overlays/DatasetLibrary';
import VisualizationLibrary from './views/overlays/VisualizationLibrary';
window.overlays = {
  startingGuide: StartingGuide,
  datasetLibrary: DatasetLibrary,
  visualizationLibrary: VisualizationLibrary
};

// Main chunks of the page
import Header from './views/layout/Header';
import WidgetPanes from './views/layout/WidgetPanes';
import Overlay from './views/layout/Overlay';
window.layout = {
  header: new Header({
    el: '#Header'
  }),
  widgetPanes: new WidgetPanes({
    el: '#WidgetPanes'
  }),
  overlay: new Overlay({
    el: '#Overlay'
  })
};

// Draw everything
function renderEverything () {
  window.layout.header.render();
  window.layout.widgetPanes.render();
  window.layout.overlay.render();
}

jQuery(window).on('hashchange', renderEverything);
window.onresize = renderEverything;
renderEverything();
