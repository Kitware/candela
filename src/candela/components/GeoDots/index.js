import d3 from 'd3';
import Geo from '../Geo';
import VisComponent from '../../VisComponent';
import { minmax } from '../../util';

export default class GeoDots extends VisComponent {
  static get spec () {
    return {
      options: [
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
            fieldTypes: ['number']
          }
        },
        {
          name: 'y',
          type: 'string',
          format: 'text',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['number']
          }
        },
        {
          name: 'size',
          type: 'string',
          format: 'text',
          optional: true,
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['number', 'integer', 'boolean']
          }
        }
      ]
    };
  }

  constructor (el, options) {
    super(el);

    let sizeTransform = 5;
    if (options.size) {
      const range = minmax(options.data.map(d => d[options.size]));
      const scale = d3.scale.linear()
        .domain([range.min, range.max])
        .range([3, 19]);

      sizeTransform = d => scale(d[options.size]);
    }

    // TODO(choudhury): don't mutate the options object directly.
    options.layers = options.layers || [];
    options.layers.push({
      type: 'feature',
      features: [
        {
          name: 'feature1',
          type: 'point',
          x: options.x,
          y: options.y,
          style: {
            radius: sizeTransform
          },
          data: options.data
        }
      ]
    });

    this.geojs = new Geo(this.el, options);
  }

  render () {
    this.geojs.render();
  }
}
