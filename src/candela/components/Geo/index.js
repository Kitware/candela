import geojs from 'geojs/geo.js';
import VisComponent from '../../VisComponent';

export default class Geo extends VisComponent {
  constructor (el, options) {
    super(el);

    const geojs_opt = options.map || {};

    this.plot = geojs.map(Object.assign({
      node: el
    }, geojs_opt));

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
