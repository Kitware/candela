import vcharts from '../../../vcharts';
import spec from './spec.json';

export default class Bar {
  static get spec () {
    return {
      options: [
        {
          name: 'data',
          type: 'table',
          format: 'objectlist'
        },
        {
          name: 'x',
          type: 'string',
          format: 'text',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
          }
        },
        {
          name: 'y',
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
    this.chart = vcharts.chart(spec, el, {
      values: options.data,
      x: options.x,
      y: options.y,
      fill: options.color,
      hover: options.hover,
      xAxis: {
        title: options.x
      },
      yAxis: {
        title: options.y
      }
    });
  }

  render () {
    this.chart.update();
  }
}
