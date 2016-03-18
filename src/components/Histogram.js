import vcharts from '../external/vcharts/src';

export default class Histogram {
  static get options () {
    return [
      {name: 'data', type: 'table'},
      {name: 'bin', type: 'string'}
    ];
  }

  constructor (el, data, options) {
    this.chart = vcharts.chart('histogram', {
      el: el,
      values: data,
      bin: options.bin
    });
  }

  render () {
    this.chart.update();
  }
}
