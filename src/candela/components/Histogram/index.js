import vcharts from '../../../vcharts';
import spec from './spec.json';

export default class Histogram {
  static get options () {
    return [
      {name: 'data', type: 'table'},
      {name: 'bin', type: 'string'},
      {name: 'aggregate', type: 'string'}
    ];
  }

  constructor (el, data, options) {
    this.chart = vcharts.chart(spec, {
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
