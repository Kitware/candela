import Geo from '../Geo';
import VisComponent from '../../VisComponent';

export default class GeoDots extends VisComponent {
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
