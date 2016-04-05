import vega from '../../util/vega';
import spec from './spec.json';

export default class Line {
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
            fieldTypes: ['date', 'number', 'integer', 'boolean']
          }
        },
        {
          name: 'y',
          type: 'string_list',
          format: 'string_list',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['date', 'number', 'integer', 'boolean']
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
