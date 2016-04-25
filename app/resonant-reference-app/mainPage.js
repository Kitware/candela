import Backbone from 'backbone';

import Router from './Router';
import User from './models/User';
import Toolchain from './models/Toolchain';

import Header from './views/layout/Header';
import WidgetPanels from './views/layout/WidgetPanels';
import Overlay from './views/layout/Overlay';
import HelpLayer from './views/layout/HelpLayer';

// Page-wide Styles
import './stylesheets/pure-css-custom-form-elements/style.css';
import './stylesheets/mainPage.css';
import './stylesheets/girderPatches.css';

// The API root is different
window.girder.apiRoot = 'api/v1';

// Our main view that coordinates each big chunk
let MainPage = Backbone.View.extend({
  initialize: function () {
    // Set up navigation
    this.router = new Router();

    // Initial empty state (assume no logged in user)
    this.currentUser = new User();

    this.listenTo(this.currentUser, 'rra:logout', () => {
      this.switchToolchain(null);
    });

    // Start no datasets and no toolchain
    this.loadedDatasets = {};
    this.toolchain = null;

    // Respond to resize events
    window.onresize = () => {
      this.render();
      this.trigger('rra:resizeWindow');
    };
  },
  render: function () {
    /*
      Because each of the big chunks of the page
      refer directly to window.mainPage, we don't
      actually add them until we call render()
    */
    if (!this.addedPageChunks) {
      this.header = new Header({
        el: '#Header'
      });
      this.widgetPanels = new WidgetPanels({
        el: '#WidgetPanels'
      });
      this.overlay = new Overlay({
        el: '#Overlay'
      });
      this.helpLayer = new HelpLayer({
        el: '#HelpLayer'
      });
      this.router.addListeners();
      this.currentUser.addListeners();
      this.header.addListeners();
      this.addedPageChunks = true;
    }

    this.header.render();
    this.widgetPanels.render();
    this.overlay.render();
    this.helpLayer.render();
  },
  newToolchain: function () {
    this.toolchain = new Toolchain();
    return this.toolchain.save()
      .then(() => {
        this.trigger('rra:createToolchain');
        this.trigger('rra:changeToolchain');
        this.toolchain.updateStatus();
      }).catch((err) => {
        this.switchToolchain(null);
        this.trigger('rra:error', err);
      });
  },
  switchToolchain: function (id) {
    if (id === null) {
      this.toolchain = null;
      this.trigger('rra:changeToolchain');
      return new Promise(() => {});
    } else {
      this.toolchain = new Toolchain({
        _id: id
      });
      
      return this.toolchain.fetch().then(() => {
        this.trigger('rra:changeToolchain');
        this.toolchain.updateStatus();
      }).catch((err) => {
        this.switchToolchain(null);
        this.trigger('rra:error', err);
      });
    }
  }
});

window.mainPage = new MainPage();

// Initialize the rendered chunks of the page
window.mainPage.render();

// Now that everything is set up, tell the router
// to apply the information it was given
window.mainPage.router.applyInitialRoute();
