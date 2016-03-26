import vcharts from '../../../vcharts';
import spec from './spec.json';

export default class Histogram {
  static get spec () {
    return {
      options: [
        {
          name: 'data',
          type: 'table',
          format: 'objectlist'
        },
        {
          name: 'bin',
          type: 'string',
          format: 'text',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
          }
        },
        {
          name: 'aggregate',
          type: 'string',
          format: 'text',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['number', 'integer', 'boolean']
          }
        }
      ]
    };
  }

  constructor (el, options) {
    this.chart = vcharts.chart(spec, {
      el: el,
      values: options.data,
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
