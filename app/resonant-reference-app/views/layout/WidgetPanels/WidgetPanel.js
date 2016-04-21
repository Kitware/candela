import Backbone from 'backbone';
import d3 from 'd3';

// All widgets that are available
// TODO: When webpack supports it, this would be
// an ideal place for code splitting... only load
// widgets as they're needed
import DatasetView from '../../widgets/DatasetView';
import MappingView from '../../widgets/MappingView';
import VisualizationView from '../../widgets/VisualizationView';
let WIDGETS = {
  DatasetView: DatasetView,
  MappingView: MappingView,
  VisualizationView: VisualizationView
};

let WidgetPanel = Backbone.View.extend({
  initialize: function (options) {
    let self = this;
    self.widget = new WIDGETS[options.widget]();
  },
  render: function () {
    let self = this;

    // We need a header
    let header = d3.select(self.el)
      .selectAll('span.sectionHeader').data([0]);
    let headerEnter = header.enter().append('span')
      .attr('class', 'sectionHeader');

    // Add the icon that goes with the panel
    headerEnter.append('img')
      .attr('src', window.mainPage.ICONS[self.widget.hashName]);

    // Add a title to the header that collapses / expands
    // the section
    headerEnter.append('h2')
      .attr('class', 'title')
      .on('click', d => {
        self.toggle();
      });
    header.select('h2.title')
      .text(self.widget.friendlyName);

    // Add a little space for the widget to
    // store status indicators and icons
    let indicatorsEnter = headerEnter.append('span')
      .attr('class', 'indicators');

    indicatorsEnter.append('span')
      .attr('class', 'indicatorText');
    indicatorsEnter.append('span')
      .attr('class', 'indicatorIcons');

    // Finally, a div (that will scroll)
    // to contain the view
    let container = d3.select(self.el)
      .selectAll('div#' + self.widget.hashName + 'Container')
      .data([0]);
    container.enter().append('div').attr({
      id: self.widget.hashName + 'Container',
      class: 'content'
    });

    // Now let's let the widget know
    // that we have its element
    self.widget.setPanel(self);

    self.widget.render();

    self.renderIndicators();
  },
  renderIndicators() {
    let self = this;

    let indicators = d3.select(self.el)
      .select('span.indicators');

    indicators.select('span.indicatorText')
      .text(self.widget.statusText.text)
      .attr('title', self.widget.statusText.title
            ? self.widget.statusText.title : null)
      .on('click', () => {
        d3.event.stopPropagation();
        if (self.widget.statusText.onclick) {
          self.widget.statusText.onclick(d3.event);
        }
      });

    // Update our set of indicator icons
    let indicatorIcons = d3.select(self.el)
      .select('span.indicatorIcons')
      .selectAll('img').data(self.widget.icons);

    indicatorIcons.enter().append('img');
    indicatorIcons.exit().remove();
    indicatorIcons.attr('src', (d) => {
      return typeof d.src === 'function' ? d.src() : d.src;
    }).attr('title', (d) => {
      let title = typeof d.title === 'function' ? d.title() : d.title;
      return title || null;
    }).on('click', (d) => {
      d3.event.stopPropagation();
      if (d.onclick) {
        d.onclick(d3.event);
      }
    });
  },
  toggle: function () {
    let self = this;
    let widgets = window.mainPage.router.getCurrentWidgets();
    let index = widgets.indexOf(self.widget.hashName);

    if (index === -1) {
      // Toggle on; expand this view
      window.mainPage.router.expandWidget(self.widget.hashName);
    } else {
      // Toggle off; minimize this view
      window.mainPage.router.minimizeWidget(self.widget.hashName);
    }
  }
});

WidgetPanel.WIDGETS = WIDGETS;
module.exports = WidgetPanel;
