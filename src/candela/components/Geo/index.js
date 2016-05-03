import $ from 'jquery';
import geojs from 'geojs/geo.js';
import VisComponent from '../../VisComponent';

export default class Geo extends VisComponent {

  constructor (el, options) {
    super(el);
    console.log(options);
    this.plot = geojs.map({
                  node: el,
                  zoom: 6,
                  center: {x: 28.9550, y: 41.0136}
                });
    this.plot.createLayer('osm');
    if (options.features) {
      for(let i = 0; i < options.features.length; ++i) {
        this.plot.createLayer('feature')
          .createFeature(options.features[i].type)
            .data(options.features[i].data)
            .position(function(d) {
              return {x: d[options.features[i].position.x],
                      y: d[options.features[i].position.y]}
            });
      }
      this.plot.draw();
    }
  }

  render () {
    this.plot.draw();
  }
}
