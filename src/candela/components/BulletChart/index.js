import VisComponent from '../../VisComponent';
import vega from '../../util/vega';
import spec from './spec.json';

export default class BulletChart extends VisComponent {
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

  constructor (el, options) {
    super(el);
    this.options = options;
  }

  render () {
    vega.parseChart(spec, this.el, this.options);
  }
}
