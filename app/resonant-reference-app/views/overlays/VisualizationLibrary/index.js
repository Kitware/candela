import Backbone from 'backbone';
import d3 from 'd3';
import myTemplate from './template.html';
import libImage from '../../../images/library.svg';
import candela from './../../../../../src';

let VisualizationLibrary = Backbone.View.extend({
  render: function () {
    let self = this;
    self.$el.html(myTemplate);
    
    // TODO: populate with available visualizations
    // (see issue #12)
    
    let libraryVisSpecs = [];
    let visName;
    for (visName in candela.components) {
      if (candela.components.hasOwnProperty(visName)) {
        libraryVisSpecs.push({
          name: visName,
          options: candela.components[visName].options
        });
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
      .text((d) => d.name);

    d3.select('div.libraryInterface').selectAll('.circleButton')
      .on('click', function (d) {
        window.toolchain.setVisualization(d);
        window.layout.overlay.render(null);
      });
  }
});

export default VisualizationLibrary;
