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
import DatasetIcon from '../../../images/dataset.svg';
import MappingIcon from '../../../images/mapping.svg';
import VisualizationIcon from '../../../images/scatterplot.svg';
let ICONS = {
  DatasetView: DatasetIcon,
  MappingView: MappingIcon,
  VisualizationView: VisualizationIcon
};

let WidgetPanel = Backbone.View.extend({
  initialize: function (spec) {
    let self = this;
    self.spec = spec;
    self.widget = new WIDGETS[spec.widgetType](self, spec);
  },
  render: function () {
    let self = this;

    // We need a header
    let header = d3.select(self.el)
      .selectAll('span.sectionHeader').data([0]);
    let headerEnter = header.enter().append('span')
      .attr('class', 'sectionHeader')
      .on('click', () => {
        self.widget.toggle();
      });

    // Add the icon that goes with the panel
    headerEnter.append('img')
      .attr('src', ICONS[self.widget.spec.widgetType]);

    // Add a title to the header that collapses / expands
    // the section
    headerEnter.append('h2')
      .attr('class', 'title');
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
  }
});

WidgetPanel.WIDGETS = WIDGETS;
module.exports = WidgetPanel;
