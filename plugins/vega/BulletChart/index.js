import VisComponent from 'candela/VisComponent';
import VegaChart from 'candela/plugins/mixin/VegaChart';
import spec from './spec.json';

export default class BulletChart extends VegaChart(VisComponent, spec) {
  static get options () {
    return [
      {
        name: 'value',
        type: 'number',
        format: 'number'
      },
      {
        name: 'title',
        type: 'string',
        format: 'text',
        optional: true
      },
      {
        name: 'subtitle',
        type: 'string',
        format: 'text',
        optional: true
      },
      {
        name: 'markers',
        type: 'number_list',
        format: 'number_list',
        optional: true
      },
      {
        name: 'ranges',
        type: 'table',
        format: 'objectlist',
        optional: true
      }
    ];
  }
}
