import VisComponent from '../../VisComponent';
import vega from '../../util/vega';
import spec from './spec.json';

export default class Heatmap extends VisComponent {
  static get spec () {
    return {
      options: [
        {
          name: 'data',
          type: 'table',
          format: 'objectlist'
        },
        {
          name: 'id',
          type: 'string',
          format: 'text',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
          }
        },
        {
          name: 'fields',
          type: 'string_list',
          format: 'text',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
          }
        },
        {
          name: 'sort',
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
    super(el, options);
    this.render();
  }

  render () {
    vega.parseChart(spec, this.el, this.options);
  }
}
