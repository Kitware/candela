import Backbone from 'backbone';

import Router from './Router';

import User from './models/User';
import UserPreferences from './models/UserPreferences';
import Toolchain from './models/Toolchain';

import Header from './views/layout/Header';
import WidgetPanels from './views/layout/WidgetPanels';
import Overlay from './views/layout/Overlay';

// Icons for each widget
import datasetIcon from './images/dataset.svg';
import mappingIcon from './images/mapping.svg';
import scatterplotIcon from './images/scatterplot.svg';
/*
import girderIcon from './images/girder.svg';
import embedIcon from './images/embed.svg';
import shareIcon from './images/share.svg';
*/

// Page-wide Styles
import './stylesheets/pure-css-custom-form-elements/style.css';
import './stylesheets/mainPage.css';

// The API root is different
window.girder.apiRoot = 'api/v1';

// Our main view that coordinates each big chunk
let MainPage = Backbone.View.extend({
  initialize: function () {
    let self = this;

    self.addedPageChunks = false;

    // Icons for each widget - several views point to these
    self.ICONS = {
      DatasetView: datasetIcon,
      MappingView: mappingIcon,
      VisualizationView: scatterplotIcon/*,
      GirderView: girderIcon,
      SharingView: shareIcon,
      EmbeddingView: embedIcon*/
    };

    // Set up navigation
    self.router = new Router();
    self.router.storeInitialRoute();

    // Initial empty state (assume no logged in user)
    self.currentUser = new User();
    self.userPreferences = new UserPreferences();

    // Set up a little event cascade for when the user logs in / out
    self.listenTo(self.currentUser, 'change', self.updateUser);

    // Listen for changes inside the preferences as well (e.g.
    // opening and closing user widgets)
    self.listenTo(self.userPreferences, 'change', self.updatePreferences);

    // Start with an empty toolchain
    self.toolchain = new Toolchain();
    
    self.listenTo(self.toolchain, 'change', self.render);
    self.listenTo(self.toolchain, 'destroy', () => {
      self.openToolchain(null);
    });

    // Respond to resize events
    window.onresize = () => {
      self.render();
    };
  },
  render: function () {
    let self = this;
    /*
      Because each of the big chunks of the page
      refer directly to window.mainApp, we don't
      actually add them until we call render()
    */
    if (!self.addedPageChunks) {
      self.header = new Header({
        el: '#Header'
      });
      self.widgetPanels = new WidgetPanels({
        el: '#WidgetPanels'
      });
      self.overlay = new Overlay({
        el: '#Overlay'
      });
      self.addedPageChunks = true;
    }

    self.router.cleanHash();
    self.header.render();
    self.widgetPanels.render();
    self.overlay.render();
  },
  openToolchain: function (id, widgets) {
    let self = this;
    widgets = widgets || self.router.getCurrentWidgets();
    
    // Do we already have a toolchain open?
    let oldToolchainId = self.toolchain.getId();

    if (oldToolchainId !== id) {
      if (id === null) {
        // null is a sneaky way we can force ourselves
        // to open an empty toolchain
        id = undefined;
      }
      
      // We're now loading a specific toolchain, so it's
      // no longer important which toolchain might
      // have been in the URL when the user first loaded
      // the page
      self.router.clearInitials();
      
      if (id === undefined) {
        // No id... create a blank toolchain
        self.toolchain.resetToDefaults();
        self.userPreferences.unsetMeta('currentToolchain');
      } else {
        self.toolchain.clear({
          silent: true
        });
        
        self.toolchain.set({
          _id: id
        }, {
          silent: true
        });
        self.toolchain.fetch({
          success: function () {
            // Cool, we've got the toolchain loaded up.
            // We know that the toolchain will have
            // added / removed widgets from the space
            // based on its own preferences, but it doesn't
            // store which ones are minimized / expanded.
            // For that, let's rely on whatever the hash
            // says:
            self.router.setWidgets(widgets);
          },
          error: function (err) {
            // Couldn't open the toolchain...
            
            // TODO: display an appropriate
            // of error message!
            console.warn(err);

            // Go to the starting screen with
            // a blank toolchain
            self.openToolchain(undefined, widgets);
          }
        });
        
        self.userPreferences.setMeta('currentToolchain', id);
      }
      // Save the new toolchain ID in the user's preferences
      // so they always start with the last toolchain they were using
      self.userPreferences.save();
    } else {
      // We've only changed which widgets
      // are minimized / expanded
      self.router.setWidgets(widgets);
    }
  },
  updateUser: function () {
    let self = this;
    
    if (self.currentUser.id === undefined) {
      // Not logged in
      self.userPreferences.resetToDefaults();
    } else {
      // We're logged in! First, let's see if
      // the user already has preferences stored
      self.userPreferences.fetch({
        error: () => {
          // Okay, they don't. Instead, let's save the
          // current state as their starting preferences
          self.userPreferences.save();
        }
      });
    }
  },
  updatePreferences: function () {
    let self = this;
    
    if (!self.finishedFirstLoad) {
      // Only load up the last toolchain the user used if
      // the URL isn't specifying another one
      let startingToolchain = self.router.initialToolchainId;
      if (startingToolchain === undefined) {
        startingToolchain = self.userPreferences.getMeta('currentToolchain');
        self.openToolchain(startingToolchain);
      } else {
        self.openToolchain(startingToolchain, self.router.initialWidgets);
      }
      self.finishedFirstLoad = true;
    } else {
      self.render();
    }
  }
});

window.mainPage = new MainPage();
window.mainPage.render();
