import Backbone from 'backbone';
import myTemplate from './template.html';
import d3 from 'd3';
import jQuery from 'jquery';

import './accordionhorz.css';
import './style.css';

import collapseIcon from '../../../images/collapse.svg';
import expandIcon from '../../../images/expand.svg';

let WidgetPanes = Backbone.View.extend({
  initialize: function () {
    let self = this;
    self.listenTo(self.model, 'change', self.render);
    self.$el.html(myTemplate);
    self.views = {};
  },
  render: function () {
    let self = this;

    // Only show widgets that aren't hidden
    let widgets = window.widgets.filter(function (d) {
      return !d.hidden;
    });
    
    // Patch on a temporary flag as to
    // which sections are expanded
    let hashes = window.location.hash.split('#');
    widgets.forEach(function (d) {
      d.targeted = hashes.indexOf(d.hashName) !== -1;
    });

    // Create sections for each widget
    let sections = d3.select(self.el)
      .select('article')
      .selectAll('section')
      .data(widgets, function (d) {
        return d.hashName;
      });

    let sectionsEnter = sections.enter().append('section');

    // Remove each view object when views are removed
    sections.exit().each(function (d) {
      delete self.views[d.hashName];
    }).remove();
    
    sections.attr('id', function (d) {
      return d.hashName;
    }).attr('class', function (d) {
      return d.targeted ? 'targeted' : null;
    });

    // We need a header for each section
    // (this will accept expand / collapse clicks)
    let headerEnter = sectionsEnter.append('h2')
      .on('click', function (d) {
        self.toggle(d.hashName);
      });
    
    // Add a little space for the widget to
    // store indicators, especially for when
    // it's collapsed
    headerEnter.append('span')
      .attr('class', 'indicators');
    
    // We need a handle for each section to expand / collapse everything
    let handlesEnter = headerEnter.append('a');
    sections.selectAll('h2').selectAll('a');

    handlesEnter.append('img');
    sections.selectAll('h2').selectAll('a').selectAll('img')
      .attr('src', function (d) {
        if (d.targeted) {
          return collapseIcon;
        } else {
          return expandIcon;
        }
      });

    handlesEnter.append('span');
    sections.selectAll('h2').selectAll('a').selectAll('span')
      .text(function (d) {
        return d.friendlyName;
      });

    // Finally, a div (that will scroll)
    // to contain the view
    sectionsEnter.append('div').attr({
      id: function (d) {
        return d.hashName + 'Container';
      },
      class: 'content'
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

    // Now let's embed the actual view
    sectionsEnter.each(function (d) {
      d.setElement(jQuery('#' + d.hashName + 'Container')[0]);
      self.views[d.hashName] = d;
    });

    // Finally, get all our views to render
    for (let viewName of Object.keys(self.views)) {
      self.views[viewName].render();
    }
  },
  toggle: function (key) {
    let self = this;
    let hashes = window.location.hash.split('#');
    let index = hashes.indexOf(key);

    if (index === -1) {
      // Toggle on; add this view
      hashes.push(key);
    } else {
      // Toggle off; collapse this view
      hashes.splice(index, 1);
    }
    window.location.hash = hashes.join('#');
    self.render();
  }
});

export default WidgetPanes;
