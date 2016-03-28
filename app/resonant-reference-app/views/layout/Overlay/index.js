import Backbone from 'backbone';
import d3 from 'd3';
import jQuery from 'jquery';

// Modal overlay views
import HamburgerMenu from '../../overlays/HamburgerMenu';
import AchievementLibrary from '../../overlays/AchievementLibrary';
import StartingGuide from '../../overlays/StartingGuide';
import DatasetLibrary from '../../overlays/DatasetLibrary';
import VisualizationLibrary from '../../overlays/VisualizationLibrary';
import ToolchainLibrary from '../../overlays/ToolchainLibrary';
let VIEWS = {
  HamburgerMenu: HamburgerMenu,
  AchievementLibrary: AchievementLibrary,
  ToolchainLibrary: ToolchainLibrary,
  StartingGuide: StartingGuide,
  DatasetLibrary: DatasetLibrary,
  VisualizationLibrary: VisualizationLibrary
};

import closeIcon from '../../../images/close.svg';
import './overlay.css';

let Overlay = Backbone.View.extend({
  initialize: function () {
    let self = this;

    if (window.location.hash === '') {
      self.render('StartingGuide');
    } else {
      self.render(null);
    }

    // Hide the overlay whenever someone
    // clicks on the background
    self.$el.on('click', function (event) {
      if (event.target !== this) {
        return;
      } else {
        self.render(null);
      }
    })
  },
  render: function (template) {
    let self = this;
    let rerendering = false;
    
    if (template === undefined) {
      // we're just re-rendering, not switching
      template = self.template;
      rerendering = true;
    } else {
      // because we're switching, save the setting
      // for next time we just re-render
      self.template = template;
    }

    if (template !== null) {
      self.$el.html('');

      if (VIEWS.hasOwnProperty(template)) {
        let temp = new VIEWS[template]();
        self.el.appendChild(temp.el);
        temp.render();
      } else {
        // Okay, this is a dynamically-generated overlay
        // (probably a widget help/info screen)... so
        // the template string is the actual contents
        self.$el.html(template);
      }

      // If the template doesn't specify a close
      // button, let's make sure one is there
      if (self.$el.find('#closeOverlay').length === 0) {
        let closeOverlay = jQuery('<img/>')
          .attr('id', 'closeOverlay')
          .attr('src', closeIcon);
        self.$el.append(closeOverlay);
      }

      jQuery('#closeOverlay').on('click', function () {
        self.render(null);
      });

      if (rerendering || template === 'StartingGuide') {
        // Don't fade in
        d3.select(self.el).style('opacity', 1.0);
      } else {
        d3.select(self.el)
          .style('display', null)
          .style('opacity', 0.0)
          .transition().duration(400)
          .style('opacity', 1.0);
      }

      jQuery(window).on('keyup', function (e) {
        if (e.keyCode === 27) {
          // Escape pressed
          self.render(null);
        }
      });
    } else {
      jQuery(window).off('keyup');
      d3.select(self.el)
        .style('opacity', 1.0)
        .transition().duration(400)
        .style('opacity', 0.0);
      window.setTimeout(function () {
        d3.select(self.el)
          .style('display', 'none');
        self.el.innerHTML = '';
      }, 500);
    }
  }
});

Overlay.VIEWS = VIEWS;
export default Overlay;
