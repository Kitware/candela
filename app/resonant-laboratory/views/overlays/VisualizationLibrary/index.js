import Backbone from 'backbone';
import d3 from 'd3';
import myTemplate from './template.html';
import libImage from '../../../images/light/library.svg';
import candela from './../../../../../src/candela';

let VisualizationLibrary = Backbone.View.extend({
  initialize: function () {
    // TODO: need to be more clever in initializing this dialog
    // when we have support for multiple visualizations
    this.index = 0;
  },
  render: function () {
    this.$el.html(myTemplate);

    // For any candela vis that has options defined, extract
    // field options for our matching options.
    // TODO: We also need to extract data options - we currently
    // assume that there will be one table option called "data".
    let libraryVisSpecs = [];
    for (let visName of Object.keys(candela.components)) {
      if (candela.components[visName].options) {
        let spec = {
          name: visName,
          options: candela.components[visName].options.filter(option => {
            return option.domain && option.domain.mode === 'field';
          })
        };
        libraryVisSpecs.push(spec);
      }
    }

    let libraryButtons = d3.select('div.visualizationLibrary')
      .selectAll('.circleButton')
      .data(libraryVisSpecs);

    let libraryButtonsEnter = libraryButtons.enter().append('div')
      .attr('class', 'circleButton');
    libraryButtons.exit().remove();

    libraryButtonsEnter.append('img');
    libraryButtons.select('img')
      .attr('src', libImage);

    libraryButtonsEnter.append('span');
    libraryButtons.select('span')
      .text(d => d.name);

    d3.select('div.largeDialog').selectAll('.circleButton')
      .on('click', d => {
        window.mainPage.getProject().then(project => {
          project.setVisualization(d.name, this.index);
          window.mainPage.widgetPanels.toggleWidget({
            hashName: 'VisualizationView' + this.index
          }, true);
          window.mainPage.overlay.closeOverlay();
        });
      });
  }
});

export default VisualizationLibrary;
