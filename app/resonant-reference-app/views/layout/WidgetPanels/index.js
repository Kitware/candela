import Backbone from 'backbone';
import d3 from 'd3';
import WidgetPanel from './WidgetPanel.js';

import './accordionhorz.css';
import './style.css';

let WidgetPanels = Backbone.View.extend({
  initialize: function () {
    let self = this;
    self.widgets = {};
  },
  isWidgetInToolchain: function (widgetName) {
    // let self = this;
    let toolchainIcons = window.mainPage.toolchain.getMeta('requiredIcons');
    return toolchainIcons.indexOf(widgetName) !== -1;
  },
  close: function (widgetName) {
    let self = this;
    /*
      Close the widget, but leave its icon up on the toolbar.
      Whether a widget is open or not is saved as part of the
      user preferences, or as part of the toolchain preferences
    */
    if (self.isWidgetInToolchain(widgetName)) {
      window.mainPage.toolchain.closeWidget(widgetName);
    } else {
      window.mainPage.userPreferences.closeWidget(widgetName);
    }

    // Remove the widget's name from the url
    // (this already triggers render calls)
    window.mainPage.router.minimizeWidget(widgetName);
  },
  open: function (widgetName) {
    let self = this;
    /*
      Add the widget if it isn't already open, and target it (in case
      it was open, but it was collapsed)
    */
    if (self.isWidgetInToolchain(widgetName)) {
      window.mainPage.toolchain.openWidget(widgetName);
    } else {
      window.mainPage.userPreferences.openWidget(widgetName);
    }

    // Remove the widget's name from the url
    // (this already triggers render calls)
    window.mainPage.router.expandWidget(widgetName);
  },
  render: function () {
    let self = this;

    let leftWidgetNames = window.mainPage.userPreferences
      .getMeta('leftWidgets');
    let toolchainWidgetNames = window.mainPage.toolchain
      .getMeta('preferredWidgets');
    let rightWidgetNames = window.mainPage.userPreferences
      .getMeta('rightWidgets');

    // Stitch together the list of widgets from
    // the user preferences and from the
    // currently open toolchain
    let widgetNames = leftWidgetNames
      .concat(toolchainWidgetNames)
      .concat(rightWidgetNames);

    // The hashes tell us which
    // ones should be expanded
    let hashes = window.mainPage.router.getCurrentWidgets();

    // Create sections for each panel
    let sections = d3.select(self.el)
      .selectAll('section')
      .data(widgetNames, (d) => d);
    let sectionsEnter = sections.enter().append('section');
    sections.exit().each((d) => {
      delete self.widgets[d];
    }).remove();

    sections.order()
      .attr('id', (d) => d)
      .attr('class', (d) => {
        return hashes.indexOf(d) !== -1 ? 'targeted' : null;
      });

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
    let expandedSections = hashes.length;
    let collapsedSections = widgetNames.length - expandedSections;
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
  }
});

export default WidgetPanels;
