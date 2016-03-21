import vcharts from '../external/vcharts/src';

export default class Histogram {
  static get options () {
    return [
      {name: 'data', type: 'table'},
      {name: 'bin', type: 'string'},
      {name: 'aggregate', type: 'string'}
    ];
  }

  constructor (el, data, options) {
    this.chart = vcharts.chart('histogram', {
      el: el,
      values: data,
      bin: options.bin,
      aggregate: options.aggregate,
      xAxis: {
        title: options.bin
      },
      yAxis: {
        title: options.aggregate ? 'Sum of ' + options.aggregate : 'Count'
      }
    });
  }

  render () {
    this.chart.update();
  }
}
