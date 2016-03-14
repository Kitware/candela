import Backbone from 'backbone';
import d3 from 'd3';

let WidgetPane = Backbone.View.extend({
  initialize: function (options) {
    let self = this;
    self.widget = options.widget;
    self.hidden = false;
  },
  render: function () {
    let self = this;
    
    // We need a header
    let header = d3.select(self.el)
      .selectAll('span.sectionHeader').data([0]);
    let headerEnter = header.enter().append('span')
      .attr('class', 'sectionHeader');
    
    // Add a title to the header that collapses / expands
    // the section
    headerEnter.append('h2')
      .attr('class', 'title')
      .on('click', (d) => {
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
    self.renderIndicators();
    
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
    self.widget.setPane(self);
  },
  renderIndicators () {
    let self = this;
    
    let indicators = d3.select(self.el)
      .select('span.indicators');
    
    indicators.select('span.indicatorText')
      .text(self.widget.statusText.text)
      .on('click', () => {
        d3.event.stopPropagation();
        self.widget.statusText.onclick(d3.event);
      });
    
    // Update our set of indicator icons
    let indicatorIcons = d3.select(self.el)
      .select('span.indicatorIcons')
      .selectAll('img').data(self.widget.icons);
    
    indicatorIcons.enter().append('img');
    indicatorIcons.exit().remove();
    indicatorIcons.attr('src', (d) => d.src())
      .on('click', (d) => {
        d3.event.stopPropagation();
        d.onclick(d3.event);
      });
  },
  toggle: function () {
    let self = this;
    let hashes = window.location.hash.split('#');
    let index = hashes.indexOf(self.widget.hashName);

    if (index === -1) {
      // Toggle on; add this view
      hashes.push(self.widget.hashName);
    } else {
      // Toggle off; collapse this view
      hashes.splice(index, 1);
    }
    window.location.hash = hashes.join('#');
    window.layout.widgetPanes.render();
  }
});

module.exports = WidgetPane;
