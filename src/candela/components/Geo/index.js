import spec from './spec.json';
import $ from 'jquery';
import geojs from 'geojs/geo.js';
import VisComponent from '../../VisComponent';
//import geojsext from 'geojs/geo.ext.min.js';

export default class Geo extends VisComponent {
  static get spec () {
    return {
      options: [
      ]
    };
  }

  constructor (el, options) {
    super(el);
    // this.chart = vega.chart(spec, el, options);
    this.plot = geojs.map({
                  node: el,
                  zoom: 6,
                  center: {x: 28.9550, y: 41.0136}
                });
    this.plot.createLayer('osm');
  }

  render () {
    this.plot.draw();
  }
}
