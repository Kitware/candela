import Underscore from 'underscore';
import Backbone from 'backbone';
import d3 from 'd3';
import jQuery from 'jquery';

// Modal overlay views
import HamburgerMenu from '../../overlays/HamburgerMenu';
import LoginView from '../../overlays/LoginView';
import RegisterView from '../../overlays/RegisterView';
import ResetPasswordView from '../../overlays/ResetPasswordView';
import AchievementLibrary from '../../overlays/AchievementLibrary';
import StartingScreen from '../../overlays/StartingScreen';
import DatasetLibrary from '../../overlays/DatasetLibrary';
import VisualizationLibrary from '../../overlays/VisualizationLibrary';
import ToolchainSettings from '../../overlays/ToolchainSettings';

import errorTemplate from './generalErrorTemplate.html';

let VIEWS = {
  HamburgerMenu: HamburgerMenu,
  LoginView: LoginView,
  ResetPasswordView: ResetPasswordView,
  RegisterView: RegisterView,
  AchievementLibrary: AchievementLibrary,
  ToolchainSettings: ToolchainSettings,
  StartingScreen: StartingScreen,
  DatasetLibrary: DatasetLibrary,
  VisualizationLibrary: VisualizationLibrary
};

import './overlay.css';

let Overlay = Backbone.View.extend({
  initialize: function () {
    let self = this;
    
    self.template = undefined;
    self.view = null;
    
    self.listenTo(window.mainPage, 'rra:changeToolchain',
        self.handleChangeToolchain);
    self.listenTo(window.mainPage, 'rra:error',
        self.handleError);
  },
  handleChangeToolchain: function () {
    let self = this;
    if (window.mainPage.toolchain === null) {
      // No toolchain is loaded; show the StartingScreen
      self.render('StartingScreen');
    }
    // Otherwise, we just stay as we are (either no
    // overlay, or the overlay that just changed stuff
    // is responsible for picking the appropriate next
    // view)
  },
  handleError: function (errorObj) {
    let self = this;
    let message;
    
    // Sometimes errors are wrapped in arrays...
    if (errorObj.length) {
      errorObj = errorObj[0];
    }
    
    if (errorObj.responseJSON && errorObj.responseJSON.message) {
      message = errorObj.responseJSON.message;
    } else if (errorObj instanceof Error) {
      message = errorObj.message;
    } else {
      // Fallback if I can't tell what it is
      message = 'Unknown error; maybe the console contains some clues';
      console.warn('Unknown error! Here\'s what I was given:', arguments);
    }
    // Let the user know something funky is up
    self.render(self.getErrorScreen(message));
    
    // Actually throw the error if it's a real one
    if (errorObj instanceof Error) {
      throw errorObj;
    }
  },
  getErrorScreen: function (message) {
    return Underscore.template(errorTemplate)({
      message: message
    });
  },
  renderErrorScreen: function (message) {
    let self = this;
    self.render(self.getErrorScreen(message));
  },
  addCloseListeners: function () {
    let self = this;
    // Add a bunch of ways to close out of the overlay
    
    // Close button:
    self.$el.find('#closeOverlay').on('click', function () {
      self.render(null);
    });
    
    // Clicking on the area outside the overlay:
    self.$el.on('click', function (event) {
      if (event.target !== this) {
        return;
      } else {
        self.render(null);
      }
    });
    
    // Hitting the escape key:
    jQuery(window).on('keyup', function (e) {
      if (e.keyCode === 27) {
        self.render(null);
      }
    });
  },
  removeCloseListeners: function () {
    let self = this;
    // Remove the ways to close out of the overlay
    // (both when the overlay is hidden, and when
    // one shows up that can't be closed)
    self.$el.find('#closeOverlay').off('click');
    self.$el.off('click');
    jQuery(window).off('keyup');
  },
  render: Underscore.debounce(function (template, nofade) {
    let self = this;
    
    // Don't fade if we're just switching between overlays
    nofade = nofade || (template !== null && self.template !== null);
    
    if (template !== undefined && self.template !== template) {
      // Because we're switching, save the setting
      // for next time we simply re-render
      self.template = template;
      
      if (template === null) {
        // Hide the overlay
        self.removeCloseListeners();
        
        // Fade out
        if (nofade !== true) {
          d3.select(self.el)
            .style('opacity', 1.0)
            .transition().duration(400)
            .style('opacity', 0.0);
          window.setTimeout(function () {
            d3.select(self.el)
              .style('display', 'none');
            self.$el.html('');
            self.view = null;
          }, 500);
        } else {
          d3.select(self.el)
            .style('display', 'none');
          self.$el.html('');
          self.view = null;
        }
      } else {
        // Instantiate and add the new view
        if (template.prototype &&
            template.prototype instanceof Backbone.View) {
          // This is a View object already
          let Template = template;
          self.$el.html('');
          self.view = new Template();
          self.el.appendChild(self.view.el);
          self.view.render();
        } else if (VIEWS.hasOwnProperty(template)) {
          // This is a named template
          self.$el.html('');
          self.view = new VIEWS[template]({
            // Some girder views expect a parent, but
            // in this app, we just run them headless
            parentView: null
          });
          self.el.appendChild(self.view.el);
          self.view.render();
        } else {
          // Okay, this is a dynamically-generated overlay
          // (probably a widget help/info screen)... so
          // the template string is the actual contents
          self.view = null;
          self.$el.html(template);
        }
        
        if (self.$el.find('#closeOverlay').length !== 0) {
          // Does this view have a close button? If so,
          // attach the ways to close it
          self.addCloseListeners();
        } else {
          // If it doesn't, that means this is an
          // overlay where the user needs to do
          // something special (e.g. load a toolchain)
          // in order to dismiss it
          self.removeCloseListeners();
        }
        
        // Fade in
        if (nofade !== true) {
          d3.select(self.el)
          .style('display', null)
          .style('opacity', 0.0)
          .transition().duration(400)
          .style('opacity', 1.0);
        } else {
          d3.select(self.el).style('opacity', 1.0);
        }
      }
    } else {
      // We're just re-rendering the view
      if (self.view !== null) {
        self.view.render();
      }
    }
  }, 300)
});

Overlay.VIEWS = VIEWS;
export default Overlay;
