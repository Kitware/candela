import Underscore from 'underscore';
import Backbone from 'backbone';
import d3 from 'd3';
import WidgetPanel from './WidgetPanel.js';

import './accordionhorz.css';
import './style.css';

let WidgetPanels = Backbone.View.extend({
  initialize: function () {
    this.widgetSpecs = [];
    this.widgets = {};
    this.expandedWidgets = new Set();
    this.listenTo(window.mainPage, 'rra:changeToolchain',
      this.handleNewToolchain);
    this.listenTo(this, 'rra:updateWidgetSpecs', this.render);
    this.listenTo(this, 'rra:navigateWidgets', this.render);
  },
  handleNewToolchain: function () {
    if (window.mainPage.toolchain) {
      this.listenTo(window.mainPage.toolchain, 'rra:changeDatasets',
        this.updateWidgetSpecs);
      this.listenTo(window.mainPage.toolchain, 'rra:changeVisualizations',
        this.updateWidgetSpecs);
    }
    this.updateWidgetSpecs();
  },
  updateWidgetSpecs: function () {
    if (window.mainPage.toolchain) {
      this.widgetSpecs = window.mainPage.toolchain.getAllWidgetSpecs();
    } else {
      this.widgetSpecs = [];
    }
    // TODO: test if widgets have actually changed
    this.trigger('rra:updateWidgetSpecs');
  },
  toggleWidget: function (widgetSpec, expand) {
    if (!this.expandedWidgets.has(widgetSpec.hashName) || expand === true) {
      this.expandedWidgets.add(widgetSpec.hashName);
    } else {
      this.expandedWidgets.delete(widgetSpec.hashName);
    }
    this.trigger('rra:navigateWidgets');
  },
  setWidgets: function (newWidgets) {
    this.expandedWidgets = newWidgets;
    this.trigger('rra:navigateWidgets');
  },
  render: Underscore.debounce(function () {
    // Create sections for each panel
    let sections = d3.select(this.el)
      .selectAll('section')
      .data(this.widgetSpecs, (d) => d.hashName);
    let sectionsEnter = sections.enter().append('section');
    sections.exit().each((d) => {
      delete this.widgets[d.hashName];
    }).remove();

    sections.attr('class', (d) => {
      return this.expandedWidgets.has(d.hashName) ? 'targeted' : null;
    });

    // Any new widgets need to have a WidgetPanel instantiated
    // and bound to the new section
    let self = this;
    sectionsEnter.each(function (d) {
      // this refers to the DOM element
      d.el = this;
      let panel = new WidgetPanel(d);
      self.widgets[d.hashName] = panel;
      panel.render();
    });

    // Distribute the space for each section
    let expandedSections = this.expandedWidgets.size;
    let collapsedSections = this.widgetSpecs.length - expandedSections;
    let style = 'calc((100% - (0.5em + ' + // a little grey space at the beginning
      '2.5*' + collapsedSections + 'em + ' + // collapsed sections are 2em wide + a grey space
      '0.5*' + expandedSections + 'em)) / ' + // grey space around each section
      expandedSections + ')';

    this.$el.find('section')
      .css('width', '');

    this.$el.find('section.targeted')
      .css('width', style);

    // Finally, get all the widgets to render
    // (don't tell them to render themselves
    // until after the animation has finished)
    window.setTimeout(() => {
      for (let hash of Object.keys(this.widgets)) {
        this.widgets[hash].render();
      };
    }, 1000);
  }, 300)
});

export default WidgetPanels;
