import VisComponent from '../../VisComponent';
import VegaChart from '../../VisComponent/mixin/VegaChart';
import spec from './spec.json';

export default class BarChart extends VegaChart(VisComponent, spec) {
  static get options () {
    return [
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
      },
      {
        name: 'color',
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
        name: 'hover',
        type: 'string_list',
        format: 'string_list',
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
