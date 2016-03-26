import vcharts from '../../../vcharts';
import spec from './spec.json';

export default class Bar {
  static get options () {
    return [
      {name: 'data', type: 'table'},
      {name: 'x', type: 'string'},
      {name: 'y', type: 'string'},
      {name: 'color', type: 'string'},
      {name: 'hover', type: 'string'}
    ];
  }

  constructor (el, options) {
    this.chart = vcharts.chart(spec, {
      el: el,
      values: options.data,
      x: options.x,
      y: options.y,
      fill: options.color,
      hover: options.hover,
      xAxis: {
        title: options.x
      },
      yAxis: {
        title: options.y
      }
    });
  }

  render () {
    this.chart.update();
  }
}
