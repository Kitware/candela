import Backbone from 'backbone';
import d3 from 'd3';
// import Dataset from '../../../models/Dataset';
import myTemplate from './template.html';
import libImage from '../../../images/light/library.svg';
// import candela from './../../../../../src';

let VisualizationLibrary = Backbone.View.extend({
  render: function () {
    let self = this;
    self.$el.html(myTemplate);

    let libraryVisSpecs = [];

    libraryVisSpecs.push({
      name: 'Scatter',
      options: [
        {
          name: 'x',
          type: 'number'
        },
        {
          name: 'y',
          type: 'number'
        },
        {
          name: 'color',
          type: 'string'
        },
        {
          name: 'size',
          type: 'number'
        },
        {
          name: 'shape',
          type: 'string'
        },
        {
          name: 'hover',
          type: 'string'
        }
      ]
    });

    libraryVisSpecs.push({
      name: 'Histogram',
      options: [
        {
          name: 'bin',
          type: 'string'
        },
        {
          name: 'aggregate',
          type: 'number'
        }
      ]
    });

    /*
      TODO: build the library from the available
      candela visualizations
    */
    /*
    for (let visName of Object.keys(candela.components)) {
      let spec = {
        name: visName,
        options: candela.components[visName]
          .options.filter(function (option) {
            // TODO: this spec will change again soon
            return Dataset.COMPATIBLE_TYPES.hasOwnProperty(option.type);
          })
      };
      libraryVisSpecs.push(spec);
      console.log(spec);
    }
    */

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
