import vcharts from '../../../vcharts';
import spec from './spec.json';

export default class Box {
  static get options () {
    return [
      {
        name: 'fields',
        type: 'string_list'
      },
      {
        name: 'data',
        type: 'table'
      },
      {
        name: 'group',
        type: 'string'
      },
      {
        name: 'boxSize',
        type: 'number'
      },
      {
        name: 'capSize',
        type: 'number'
      }
    ];
  }

  constructor (el, options) {
    this.chart = vcharts.chart(spec, {
      el: el,
      values: options.data,
      group: options.group,
      fields: options.fields,
      boxSize: options.boxSize,
      capSize: options.capSize
    });
  }

  render () {
    this.chart.update();
  }
}
