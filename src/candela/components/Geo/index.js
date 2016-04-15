import spec from './spec.json';
import $ from 'jquery';
import jQuery from 'jquery';
import geojs from 'geojs/geo.js';

export default class Geo {
  static get spec () {
    return {
      options: [
      ]
    };
  }

  constructor (el, options) {
    // this.chart = vega.chart(spec, el, options);
    this.plot = geojs.map({
                  node: el,
                  zoom: 6,
                  center: {x: 28.9550, y: 41.0136}
                });
  }

  render () {
    this.plot.draw();
  }
}
