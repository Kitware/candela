import geojs from 'geojs/geo.js';
import VisComponent from '../../VisComponent';

export default class Geo extends VisComponent {
  constructor (el, options) {
    super(el);

    this.plot = geojs.map({
      node: el,
      zoom: 10,
      center: {
        x: -87.6194,
        y: 41.867516
      }
    });
    this.plot.createLayer('osm', {
      renderer: null
    });
    if (options.features) {
      options.features.forEach(feature => {
        let x = this.plot.createLayer('feature', {
          renderer: 'd3'
        })
          .createFeature(feature.type)
          .data(feature.data)
          .position(d => ({
            x: d[feature.x],
            y: d[feature.y]
          }))
          .style('fillColor', 'red')
          .style('strokeColor', 'darkred');
      });
      this.plot.draw();
    }
  }

  render () {
    this.plot.draw();
  }
}
