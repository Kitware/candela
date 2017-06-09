import VisComponent from 'candela/VisComponent';
import VegaChart from 'candela/plugins/mixin/VegaChart';
import spec from './spec.json';

export default class Heatmap extends VegaChart(VisComponent, spec) {
  static get options () {
    return [
      {
        name: 'data',
        type: 'table',
        format: 'objectlist'
      },
      {
        name: 'id',
        type: 'string',
        format: 'text',
        optional: true,
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
        optional: true,
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      }
    ];
  }
}
