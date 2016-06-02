import geojs from 'geojs/geo.js';
import VisComponent from '../../VisComponent';

export default class Geo extends VisComponent {
  constructor (el, options) {
    super(el);

    this.plot = geojs.map({
      node: el,
      zoom: 6,
      center: {x: 0, y: 0}
    });
    this.plot.createLayer('osm', {
      renderer: null
    });
    if (options.features) {
      options.features.forEach(feature => {
        this.plot.createLayer('feature', {
            renderer: 'd3'
          })
          .createFeature(feature.type)
          .data(feature.data)
          .position(d => ({
            x: d[feature.x],
            y: d[feature.y]
          }));
      });
      this.plot.draw();
    }
  }

  render () {
    this.plot.draw();
  }
}
