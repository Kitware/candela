import vega from '../../util/vega';
import spec from './spec.json';

export default class Bullet {
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
        format: 'text'
      },
      {
        name: 'subtitle',
        type: 'string',
        format: 'text'
      },
      {
        name: 'markers',
        type: 'number_list',
        format: 'number_list'
      },
      {
        name: 'ranges',
        type: 'table',
        format: 'objectlist'
      }
    ];
  }

  constructor (el, options) {
    this.chart = vega.chart(spec, el, options);
  }

  render () {
    this.chart.update();
  }
}
