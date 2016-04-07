import Underscore from 'underscore';
import Backbone from 'backbone';
import d3 from 'd3';
import jQuery from 'jquery';

// Modal overlay views
import HamburgerMenu from '../../overlays/HamburgerMenu';
import AchievementLibrary from '../../overlays/AchievementLibrary';
import StartingScreen from '../../overlays/StartingScreen';
import ErrorScreen from '../../overlays/ErrorScreen';
import DatasetLibrary from '../../overlays/DatasetLibrary';
import VisualizationLibrary from '../../overlays/VisualizationLibrary';
import ToolchainSettings from '../../overlays/ToolchainSettings';

let girder = window.girder;

let VIEWS = {
  HamburgerMenu: HamburgerMenu,
  AchievementLibrary: AchievementLibrary,
  ToolchainSettings: ToolchainSettings,
  StartingScreen: StartingScreen,
  ErrorScreen: ErrorScreen,
  DatasetLibrary: DatasetLibrary,
  VisualizationLibrary: VisualizationLibrary
};

import './overlay.css';

let Overlay = Backbone.View.extend({
  initialize: function () {
    let self = this;
    
    self.template = undefined;
    self.view = null;
    
    // TODO: listen to events
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
            (template.prototype instanceof Backbone.View ||
             template.prototoype instanceof girder.View)) {
          // This is a View object already
          let Template = template;
          self.$el.html('');
          self.view = new Template();
          self.el.appendChild(self.view.el);
          self.view.render();
        } else if (VIEWS.hasOwnProperty(template)) {
          // This is a named template
          self.$el.html('');
          self.view = new VIEWS[template]();
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
