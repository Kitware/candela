import VisualizationComponent from './../resplendent';
import $ from 'jquery';

export default class ParallelCoordinates extends VisualizationComponent {
  constructor (div, dataRoot, width, height) {
    super(div);
    this.dataRoot = dataRoot;

    if (width && height) {
      $(div).attr('width', width);
      $(div).attr('height', height);
    }

    let PC = require('./../external/pc');

    this.pc = new PC(this.div, (var1, var2, callback) => {
      this.fetchHistogram(var1, var2).then(callback);
    });
  }

  refresh (data) {
    this.pc.updateAxisList(data);
    this.pc.render();
  }

  fetchHistogram (var1, var2) {
    return $.getJSON([this.dataRoot, var1, var2].join('/') + '.json');
  }
}
