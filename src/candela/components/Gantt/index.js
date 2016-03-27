import vcharts from '../../../vcharts';
import spec from './spec.json';

export default class Gantt {
  static get options () {
    return [
      {
        name: 'data',
        type: 'table',
        format: 'objectlist'
      }
    ];
  }

  constructor (el, options) {
    this.chart = vcharts.chart(spec, el, options);
  }

  render () {
    this.chart.update();
  }
}
