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

    this.geojs = new Geo(this.el, {
      geojs: options.geojs,
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
  }

  render () {
    this.geojs.render();
  }
}
