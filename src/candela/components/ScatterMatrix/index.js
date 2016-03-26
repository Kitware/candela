import vcharts from '../../../vcharts';
import spec from './spec.json';

export default class ScatterMatrix {
  static get spec () {
    return {
      options: [
        {
          name: 'data',
          type: 'table',
          format: 'objectlist'
        },
        {
          name: 'fields',
          type: 'string_list',
          format: 'string_list',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['number', 'integer', 'boolean']
          }
        },
        {
          name: 'color',
          type: 'string',
          format: 'text',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
          }
        }
      ]
    };
  }

  constructor (el, options) {
    this.chart = vcharts.chart(spec, {
      el: el,
      values: options.data,
      fields: options.fields,
      color: {
        field: options.color
      }
    });
  }

  render () {
    this.chart.update();
  }
}
