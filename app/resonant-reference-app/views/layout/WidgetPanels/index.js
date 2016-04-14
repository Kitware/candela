import Underscore from 'underscore';
import Backbone from 'backbone';
import d3 from 'd3';
import WidgetPanel from './WidgetPanel.js';

import './accordionhorz.css';
import './style.css';

let WidgetPanels = Backbone.View.extend({
  initialize: function () {
    let self = this;
    self.widgets = [];
    self.widgetSpecs = [];
    self.expandedWidgets = [];
    self.listenTo(window.mainPage, 'rra:changeToolchain',
      self.handleNewToolchain);
  },
  handleNewToolchain: function () {
    let self = this;
    if (window.mainPage.toolchain) {
      self.listenTo(window.mainPage.toolchain, 'rra:changeDatasets',
        self.changeWidgetSpecs);
      self.listenTo(window.mainPage.toolchain, 'rra:changeVisualizations',
        self.changeWidgetSpecs);
    }
    self.changeWidgetSpecs();
  },
  changeWidgetSpecs: function () {
    let self = this;
    if (window.mainPage.toolchain) {
      self.widgetSpecs = window.mainPage.toolchain.getAllWidgetSpecs();
    } else {
      self.widgetSpecs = [];
    }
    // TODO: test if widgets have actually changed
    self.trigger('rra:changeWidgetSpecs');
  },
  expandWidget: function (widgetSpec) {
  },
  collapseWidget: function (widgetSpec) {
  },
  render: Underscore.debounce(() => {
    let self = this;

    // Create sections for each panel
    let sections = d3.select(self.el)
      .selectAll('section')
      .data(self.widgetSpecs, (d) => d);
    let sectionsEnter = sections.enter().append('section');
    sections.exit().each((d) => {
      // delete self.widgets[d];
    }).remove();

    // Any new widgets need to have a WidgetPanel instantiated
    // and bound to the new section
    sectionsEnter.each(function (d) {
      let panel = new WidgetPanel({
        widget: d,
        el: this
      });
      panel.render();
      self.widgets[d] = panel;
    });

    // Distribute the space for each section
    let expandedSections = self.expandedWidgets.length;
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
      for (let widgetName of Object.keys(self.widgets)) {
        self.widgets[widgetName].render();
      };
    }, 1000);
  }, 300)
});

export default WidgetPanels;
