import vcharts from '../../../vcharts';
import spec from './spec.json';

export default class Bullet {
  static get options () {
    return [
      {
        name: 'value',
        type: 'number'
      },
      {
        name: 'title',
        type: 'string'
      },
      {
        name: 'subtitle',
        type: 'string'
      },
      {
        name: 'markers',
        type: 'number_list'
      },
      {
        name: 'ranges',
        type: 'table'
      }
    ];
  }

  constructor (el, options) {
    this.chart = vcharts.chart(spec, {
      el: el,
      value: options.value,
      title: options.title || '',
      subtitle: options.subtitle || '',
      markers: options.markers.map(v => ({value: v})),
      ranges: options.ranges
    });
  }

  render () {
    this.chart.update();
  }
}
