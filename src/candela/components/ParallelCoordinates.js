import VisComponent from '../VisComponent';
import $ from 'jquery';

export default class ParallelCoordinates extends VisComponent {
  constructor (el, {dataRoot, fields, width, height}) {
    super(el);
    this.dataRoot = dataRoot;

    if (width && height) {
      $(el).attr('width', width);
      $(el).attr('height', height);
    }

    let PC = require('./../../external/pc');

    this.pc = new PC(this.el, (var1, var2, callback) => {
      this.fetchHistogram(var1, var2).then(callback);
    });

    let mouseHandler = action => e => {
      let rect = this.el.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      this.pc.mouseHandler({x, y, action});
    };

    this.pc.updateAxisList(fields);

    $(el).on('mousedown', mouseHandler('mousedown'));
    $(el).on('mousemove', mouseHandler('mousemove'));
    $(el).on('mouseup', mouseHandler('mouseup'));
  }

  render (data) {
    this.pc.render();
  }

  fetchHistogram (var1, var2) {
    return $.getJSON([this.dataRoot, var1, var2].join('/') + '.json');
  }
}
