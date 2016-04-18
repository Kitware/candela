import Underscore from 'underscore';
import Backbone from 'backbone';
import d3 from 'd3';
import WidgetPanel from './WidgetPanel.js';

import './accordionhorz.css';
import './style.css';

let WidgetPanels = Backbone.View.extend({
  initialize: function () {
    let self = this;
    self.widgetSpecs = [];
    self.widgets = {};
    self.expandedWidgets = new Set();
    self.listenTo(window.mainPage, 'rra:changeToolchain',
      self.handleNewToolchain);
    self.listenTo(self, 'rra:updateWidgetSpecs', self.render);
    self.listenTo(self, 'rra:expandWidget', self.render);
    self.listenTo(self, 'rra:minimizeWidget', self.render);
  },
  handleNewToolchain: function () {
    let self = this;
    if (window.mainPage.toolchain) {
      self.listenTo(window.mainPage.toolchain, 'rra:changeDatasets',
        self.updateWidgetSpecs);
      self.listenTo(window.mainPage.toolchain, 'rra:changeVisualizations',
        self.updateWidgetSpecs);
    }
    self.updateWidgetSpecs();
  },
  updateWidgetSpecs: function () {
    let self = this;
    if (window.mainPage.toolchain) {
      self.widgetSpecs = window.mainPage.toolchain.getAllWidgetSpecs();
    } else {
      self.widgetSpecs = [];
    }
    // TODO: test if widgets have actually changed
    self.trigger('rra:updateWidgetSpecs');
  },
  toggleWidget: function (widgetSpec, expand) {
    let self = this;
    if (!self.expandedWidgets[widgetSpec.hashName] || expand === true) {
      self.expandedWidgets[widgetSpec.hashName] = true;
      self.trigger('rra:expandWidget');
    } else {
      delete self.expandedWidgets[widgetSpec.hashName];
      self.trigger('rra:minimizeWidget');
    }
  },
  render: Underscore.debounce(function () {
    let self = this;

    // Create sections for each panel
    let sections = d3.select(self.el)
      .selectAll('section')
      .data(self.widgetSpecs, (d) => d.hashName);
    let sectionsEnter = sections.enter().append('section');
    sections.exit().each((d) => {
      delete self.widgets[d.hashName];
    }).remove();
    
    sections.attr('class', (d) => {
      return self.expandedWidgets[d.hashName] === true ? 'targeted' : null;
    });

    // Any new widgets need to have a WidgetPanel instantiated
    // and bound to the new section
    sectionsEnter.each(function (d) {
      d.el = this;
      let panel = new WidgetPanel(d);
      self.widgets[d.hashName] = panel;
      panel.render();
    });

    // Distribute the space for each section
    let expandedSections = Object.keys(self.expandedWidgets).length;
    let collapsedSections = self.widgetSpecs.length - expandedSections;
    let style = 'calc((100% - (0.5em + ' + // a little grey space at the beginning
      '2.5*' + collapsedSections + 'em + ' + // collapsed sections are 2em wide + a grey space
      '0.5*' + expandedSections + 'em)) / ' + // grey space around each section
      expandedSections + ')';

    self.$el.find('section')
      .css('width', '');

    self.$el.find('section.targeted')
      .css('width', style);

    // Finally, get all the widgets to render
    // (don't tell them to render themselves
    // until after the animation has finished)
    window.setTimeout(function () {
      for (let hash of Object.keys(self.widgets)) {
        self.widgets[hash].render();
      };
    }, 1000);
  }, 300)
});

export default WidgetPanels;
