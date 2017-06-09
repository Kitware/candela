import VisComponent from 'candela/VisComponent';
import VegaChart from 'candela/plugins/mixin/VegaChart';
import spec from './spec.json';

export default class Histogram extends VegaChart(VisComponent, spec) {
  static get options () {
    return [
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
        optional: true,
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['number', 'integer', 'boolean']
        }
      }
    ];
  }
}
