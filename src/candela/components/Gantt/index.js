import vega from '../../util/vega';
import spec from './spec.json';

export default class Gantt {
  static get spec () {
    return {
      options: [
        {
          name: 'data',
          type: 'table',
          format: 'objectlist'
        },
        {
          name: 'label',
          type: 'string',
          format: 'text',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
          }
        },
        {
          name: 'level',
          type: 'string',
          format: 'text',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
          }
        },
        {
          name: 'start',
          type: 'string',
          format: 'text',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['number', 'integer', 'boolean']
          }
        },
        {
          name: 'end',
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
    this.chart = vega.chart(spec, el, options);
  }

  render () {
    this.chart.update();
  }
}
