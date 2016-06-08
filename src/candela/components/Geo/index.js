import geojs from 'geojs/geo.js';
import VisComponent from '../../VisComponent';

export default class Geo extends VisComponent {
  constructor (el, {map = {}, layers = []}) {
    super(el);

    // Construct a GeoJS map object based on the requested options.
    this.plot = geojs.map(Object.assign({
      node: el
    }, map));

    // Process the requested layers.
    layers.forEach(layer => {
      switch (layer.type) {
        case 'osm':
          this.plot.createLayer('osm', layer);
          break;

        case 'feature':
          layer.features.forEach(feature => {
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
          break;
      }
    });

    this.render();
  }

  render () {
    this.plot.draw();
  }
}
