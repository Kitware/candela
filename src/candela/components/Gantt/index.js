import vcharts from '../../../vcharts';
import spec from './spec.json';

export default class Gantt {
  static get options () {
    return [
      {
        name: 'values',
        type: 'table'
      },
      {
        name: 'xAxis',
        type: 'number_list'
      }
    ];
  }

  constructor (el, options) {
    this.chart = vcharts.chart(spec, {
      el: el,
      values: options.values,
      xAxis: options.xAxis
    });
  }

  render () {
    this.chart.update();
  }
}
