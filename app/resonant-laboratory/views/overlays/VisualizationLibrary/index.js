import Backbone from 'backbone';
import d3 from 'd3';
import myTemplate from './template.html';
import libImage from '../../../images/light/library.svg';
import candela from './../../../../../src/candela';

let VisualizationLibrary = Backbone.View.extend({
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
    libraryButtons.selectAll('img')
      .attr('src', libImage);

    libraryButtonsEnter.append('span');
    libraryButtons.selectAll('span')
      .text(d => d.name);

    d3.select('div.libraryInterface').selectAll('.circleButton')
      .on('click', d => {
        let projectPromise;
        if (window.mainPage.project) {
          projectPromise = Promise.resolve(window.mainPage.project);
        } else {
          // No project is loaded, so create an empty
          // project with this visualization
          projectPromise = window.mainPage.newProject();
        }
        projectPromise.then(() => {
          window.mainPage.project.setVisualization(d.name);
          window.mainPage.widgetPanels.toggleWidget({
            hashName: 'VisualizationView0'
          }, true);
          window.mainPage.overlay.closeOverlay();
        });
      });
  }
});

export default VisualizationLibrary;
