import Backbone from 'backbone';
import d3 from 'd3';
import WidgetPane from './WidgetPane.js';

import './accordionhorz.css';
import './style.css';

let WidgetPanes = Backbone.View.extend({
  initialize: function () {
    let self = this;
    self.listenTo(self.model, 'change', self.render);
  },
  render: function () {
    let self = this;
    
    // Only show widgets that aren't hidden
    let widgets = window.widgets.filter(function (d) {
      return !d.hidden;
    });
    
    let hashes = window.location.hash.split('#');
    
    // Create sections for each pane
    let sections = d3.select(self.el)
      .selectAll('section')
      .data(widgets, function (d) {
        return d.hashName;
      });
    let sectionsEnter = sections.enter().append('section');
    sections.exit().remove();
    
    sections.attr('id', function (d) {
      return d.hashName;
    }).attr('class', function (d) {
      return hashes.indexOf(d.hashName) !== -1 ? 'targeted' : null;
    });
    
    // Any new widgets need to have a WidgetPane instantiated
    // and bound to the new section
    sectionsEnter.each(function (d) {
      let pane = new WidgetPane({
        widget: d,
        el: this
      });
      pane.render();
    });

    // Distribute the space for each section
    let expandedSections = hashes.length - 1;
    let collapsedSections = widgets.length - expandedSections;
    let style = 'calc((100% - (0.5em + ' + // a little grey space at the beginning
      '2.5*' + collapsedSections + 'em + ' + // collapsed sections are 2em wide + a grey space
      '2.5*' + expandedSections + 'em)) / ' + // expanded sections have a total of 2em of padding, + their grey space
      expandedSections + ')';

    self.$el.find('section')
      .css('width', '');

    self.$el.find('section.targeted')
      .css('width', style);

    // Finally, get all the widgets to render
    // (don't tell them to render themselves
    // until after the animation has finished)
    window.setTimeout(function () {
      window.widgets.forEach(function (widget) {
        widget.render();
      });
    }, 1000);
  }
});

export default WidgetPanes;
