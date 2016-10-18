import geojs from 'geojs/geo.js';
import VisComponent from '../../VisComponent';

export default class Geo extends VisComponent {
  constructor (el, {map = {}, layers = [], width, height}) {
    super(el);

    width = width || map.width || 600;
    height = height || map.height || 600;

    el.style.width = width + 'px';
    el.style.height = height + 'px';

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
          layer.features.forEach(spec => {
            let feature = this.plot.createLayer('feature', {
              renderer: 'd3'
            })
              .createFeature(spec.type)
              .data(spec.data)
              .position(d => ({
                x: d[spec.x],
                y: d[spec.y]
              }));

            const style = Object.assign({
              fillColor: 'red',
              strokeColor: 'darkred'
            }, spec.style);

            feature.style(style);
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
