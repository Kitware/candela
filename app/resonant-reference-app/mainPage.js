import jQuery from 'jquery';
import Backbone from 'backbone';

import User from './models/User';
import UserPreferences from './models/UserPreferences';

//import Header from './views/layout/Header';
//import WidgetPanels from './views/layout/WidgetPanels';
//import Overlay from './views/layout/Overlay';

// Page-wide Styles
import './stylesheets/pure-css-custom-form-elements/style.css';
import './stylesheets/mainPage.css';

// The API root is different
window.girder.apiRoot = 'api/v1';

let MainView = Backbone.View.extend({
  initialize: function () {
    let self = this;
    self.currentUser = new User();

    // Get the user's preferences
    self.userPreferences = new UserPreferences();

    // Whenever they change, we'll need to redraw big
    // chunks of the screen
    self.listenTo(self.userPreferences, 'rra:prefsChanged', self.render);

    // We won't actually have access to the user's preferences
    // item in their Private folder until we actually have the
    // authenticated user...
    self.listenTo(self.currentUser, 'change', () => {
      if (self.currentUser.id === undefined) {
        // Not logged in
        self.userPreferences.resetToDefaults();
      } else {
        // We're logged in! First, let's see if
        // the user already has preferences stored
        self.userPreferences.fetch({
          error: () => {
            // Okay, they don't. Instead, let's save the
            // defaults as their starting preferences
            self.userPreferences.save();
          }
        })
      }
    });

    // Main chunks of the page
    /*
    self.header = new Header({
      el: '#Header'
    });
    self.widgetPanels = new WidgetPanels({
      el: '#WidgetPanels'
    });
    self.overlay = new Overlay({
      el: '#Overlay'
    });

    jQuery(window).on('hashchange', () => {
      self.render();
    });
    window.onresize = () => {
      self.render();
    };
    */
  },
  render: function () {
    /*
    let self = this;
    self.header.render();
    self.widgetPanels.render();
    self.overlay.render();
    */
  }
});

window.mainView = new MainView();
window.mainView.render();
