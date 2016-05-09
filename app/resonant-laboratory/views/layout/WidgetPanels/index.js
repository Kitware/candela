import Underscore from 'underscore';
import Backbone from 'backbone';
import jQuery from 'jquery';
import d3 from 'd3';

import './accordionhorz.css';
import './style.css';

import WidgetPanel from './WidgetPanel.js';
import SetOps, { Set } from '../../../shims/SetOps.js';

let WidgetPanels = Backbone.View.extend({
  initialize: function () {
    this.widgetSpecs = [];
    this.widgets = {};
    this.expandedWidgets = new Set();
    this.listenTo(window.mainPage, 'rl:changeProject',
      this.handleNewProject);
    this.widgetsChanged = true;
    this.listenTo(this, 'rl:updateWidgetSpecs', this.render);
  },
  handleNewProject: function () {
    if (window.mainPage.project) {
      this.listenTo(window.mainPage.project, 'rl:changeDatasets',
        this.updateWidgetSpecs);
      this.listenTo(window.mainPage.project, 'rl:changeVisualizations',
        this.updateWidgetSpecs);
    }
    this.updateWidgetSpecs();
  },
  updateWidgetSpecs: function () {
    if (window.mainPage.project) {
      this.widgetSpecs = window.mainPage.project.getAllWidgetSpecs();
    } else {
      this.widgetSpecs = [];
    }
    this.expandedWidgets = SetOps.intersection(this.expandedWidgets,
      new Set(this.widgetSpecs.map(spec => spec.hashName)));
    this.widgetsChanged = true;
    this.trigger('rl:updateWidgetSpecs');
  },
  toggleWidget: function (widgetSpec, expand) {
    if (!this.expandedWidgets.has(widgetSpec.hashName) || expand === true) {
      this.expandedWidgets.add(widgetSpec.hashName);
    } else {
      this.expandedWidgets.delete(widgetSpec.hashName);
    }
    this.widgetsChanged = true;
    this.render();
  },
  setWidgets: function (newWidgets) {
    this.expandedWidgets = newWidgets;
    this.widgetsChanged = true;
    this.render();
  },
  closeWidgets: function () {
    this.setWidgets(new Set());
  },
  render: Underscore.debounce(function () {
    // Create sections for each panel
    let sections = d3.select(this.el)
      .selectAll('section')
      .data(this.widgetSpecs, (d) => d.hashName);
    let sectionsEnter = sections.enter().append('section');
    sections.exit().each((d) => {
      this.widgets[d.hashName].stopListening();
      delete this.widgets[d.hashName];
    }).remove();

    sections.order()
      .attr('id', (d) => d.hashName)
      .attr('class', (d) => {
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

    // Are all the widgets closed (and no overlay is showing)?
    if (expandedSections === 0 &&
      window.mainPage.overlay.template === null) {
      // Show the empty state image
      jQuery('#EmptyState')
        .css('left', (1.5 + 2.5 * collapsedSections) + 'em')
        .show();
    } else {
      // Hide the empty state image
      jQuery('#EmptyState').hide();
    }

    // Finally, get all the widgets to render
    // (don't tell them to render themselves
    // until after the animation has finished)
    if (this.widgetsChanged === true) {
      this.widgetsChanged = false;
      window.setTimeout(() => {
        this.trigger('rl:navigateWidgets');
      }, 1000);
    }
  }, 300)
});

export default WidgetPanels;
