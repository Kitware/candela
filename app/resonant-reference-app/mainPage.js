import Backbone from 'backbone';

import Router from './Router';
import User from './models/User';
import Toolchain from './models/Toolchain';

import Header from './views/layout/Header';
// import WidgetPanels from './views/layout/WidgetPanels';
import Overlay from './views/layout/Overlay';

// Page-wide Styles
import './stylesheets/pure-css-custom-form-elements/style.css';
import './stylesheets/mainPage.css';

// The API root is different
window.girder.apiRoot = 'api/v1';

// Our main view that coordinates each big chunk
let MainPage = Backbone.View.extend({
  initialize: function () {
    let self = this;

    // Set up navigation
    self.router = new Router();
    
    // Initial empty state (assume no logged in user)
    self.currentUser = new User();
    
    // Start without a toolchain
    self.toolchain = null;

    // Respond to resize events
    window.onresize = () => {
      self.render();
    };
  },
  render: function () {
    let self = this;
    /*
      Because each of the big chunks of the page
      refer directly to window.mainPage, we don't
      actually add them until we call render()
    */
    if (!self.addedPageChunks) {
      self.header = new Header({
        el: '#Header'
      });
      /* self.widgetPanels = new WidgetPanels({
        el: '#WidgetPanels'
      });*/
      self.overlay = new Overlay({
        el: '#Overlay'
      });
      self.router.addListeners();
      self.addedPageChunks = true;
    }

    self.header.render();
    // self.widgetPanels.render();
    self.overlay.render();
  },
  newToolchain: function () {
    let self = this;
    self.toolchain = new Toolchain();
    return self.toolchain.create(self.toolchain.defaults(), {
      success: function () {
        self.currentUser.preferences
          .addRecentToolchain(self.toolchain.getId());
        self.trigger('rra:changeToolchain');
      },
      error: function (err) {
        self.switchToolchain(null, err);
      }
    });
  },
  switchToolchain: function (id, displayError) {
    let self = this;
    
    if (id === null) {
      self.toolchain = null;
      if (displayError) {
        self.overlay.render('ErrorScreen');
      } else {
        self.overlay.render('StartingScreen');
      }

      self.trigger('rra:changeToolchain');
      return new Promise(() => {});
    } else {
      self.toolchain = new Toolchain({
        _id: id
      });

      return self.toolchain.fetch({
        success: function () {
          self.currentUser.preferences
            .addRecentToolchain(self.toolchain.getId());
          self.trigger('rra:changeToolchain');
        },
        error: function (err) {
          self.switchToolchain(null, err);
        }
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
