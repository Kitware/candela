import Backbone from 'backbone';
import d3 from 'd3';
import jQuery from 'jquery';

import './overlay.css';

let Overlay = Backbone.View.extend({
  initialize: function () {
    let self = this;
    
    if (window.location.hash === '') {
      self.render('startingGuide');
    } else {
      self.render(null);
    }
  },
  render: function (template) {
    let self = this;

    if (template === undefined) {
      // we're just re-rendering, not switching
      template = self.template;
    } else {
      // because we're switching, save the setting
      // for next time we just re-render
      self.template = template;
    }
    
    if (template !== null) {
      self.$el.html('');
      
      let temp = new window.overlays[template]();
      self.el.appendChild(temp.el);
      temp.render();
      
      if (template === 'startingGuide') {
        // Don't bother fading in the startingGuide
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

export default Overlay;
