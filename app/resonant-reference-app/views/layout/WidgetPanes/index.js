import Backbone from 'backbone';
import myTemplate from './template.html';
import d3 from 'd3';

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
      return !d.value.hidden;
    });
    
    // Patch on a temporary flag as to
    // which sections are expanded
    let hashes = window.location.hash.split('#');
    widgets.forEach(function (d) {
      d.targeted = hashes.indexOf(d.key) !== -1;
    });

    // Create sections for each widget
    let sections = d3.select(self.el)
      .select('article')
      .selectAll('section')
      .data(widgets, function (d) {
        return d.key;
      });

    let sectionsEnter = sections.enter().append('section');

    // Remove each view object when views are removed
    sections.exit().each(function (d) {
      delete self.views[d.key];
    }).remove();

    sections.attr('id', function (d) {
      return d.key;
    }).attr('class', function (d) {
      return d.targeted ? 'targeted' : null;
    });

    // We need a header/handle for each section
    let handlesEnter = sectionsEnter.append('h2').append('a');
    sections.selectAll('h2').selectAll('a')
      .on('click', function (d) {
        self.toggle(d.key);
      });

    handlesEnter.append('img');
    sections.selectAll('h2').selectAll('a').selectAll('img')
      .attr('src', function (d) {
        // TODO: why isn't the icon changing?
        if (d.targeted) {
          return collapseIcon;
        } else {
          return expandIcon;
        }
      });

    handlesEnter.append('span');
    sections.selectAll('h2').selectAll('a').selectAll('span')
      .text(function (d) {
        return d.value.friendlyName;
      });

    // Finally, a div (that will scroll)
    // to contain the view
    sectionsEnter.append('div').attr({
      id: function (d) {
        return d.key + 'Container';
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
      let model = d.value.model;
      model = self.model.getCurrentwidgetchain().get(model);

      let ViewClass = d.value.view;

      let newView = new ViewClass({
        el: '#' + d.key + 'Container',
        model: model
      });

      self.views[d.key] = newView;
    });

    // Finally, get all our views to render
    let view;
    for (view in self.views) {
      if (self.views.hasOwnProperty(view)) {
        self.views[view].render();
      }
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
