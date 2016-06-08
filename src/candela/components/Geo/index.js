import geojs from 'geojs/geo.js';
import VisComponent from '../../VisComponent';

export default class Geo extends VisComponent {
  constructor (el, {map = {}, baseLayer = {}, features = []}) {
    super(el);

    // Construct a GeoJS map object based on the requested options.
    this.plot = geojs.map(Object.assign({
      node: el
    }, map));

    // Create a base layer.
    if (baseLayer !== null) {
      // Set default base layer options.
      baseLayer.type = baseLayer.type || 'osm';
      baseLayer.renderer = baseLayer.renderer || null;

      this.plot.createLayer(baseLayer.type, baseLayer);
    }

    // Set up requested feature layers.
    features.forEach(feature => {
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

    this.render();
  }

  render () {
    this.plot.draw();
  }
}
