import VisComponent from 'candela/VisComponent';
import VegaChart from 'candela/packages/candela-mixin/VegaChart';
import spec from './spec.json';

export default class ScatterPlotMatrix extends VegaChart(VisComponent, spec) {
  static get options () {
    return [
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
