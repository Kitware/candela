import VisualizationComponent from './../resplendent';
import $ from 'jquery';

export default class ParallelCoordinates extends VisualizationComponent {
  constructor (el, dataRoot, width, height) {
    super(el);
    this.dataRoot = dataRoot;

    if (width && height) {
      $(el).attr('width', width);
      $(el).attr('height', height);
    }

    let PC = require('./../external/pc');

    this.pc = new PC(this.el, (var1, var2, callback) => {
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
