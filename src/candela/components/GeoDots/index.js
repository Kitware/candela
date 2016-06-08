import Geo from '../Geo';
import VisComponent from '../../VisComponent';

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
        }
      ]
    };
  }

  constructor (el, options) {
    super(el);

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
