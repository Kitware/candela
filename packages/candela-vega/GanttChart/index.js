import VisComponent from 'candela/VisComponent';
import VegaChart from 'candela/VisComponent/mixin/VegaChart';
import spec from './spec.json';

export default class GanttChart extends VegaChart(VisComponent, spec) {
  static get options () {
    return [
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
    ];
  }
}
