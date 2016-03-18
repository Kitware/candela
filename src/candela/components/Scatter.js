import vcharts from '../../vcharts/src';

export default class Scatter {
  static get options () {
    return [
      {name: 'data', type: 'table'},
      {name: 'x', type: 'string'},
      {name: 'y', type: 'string'},
      {name: 'color', type: 'string'},
      {name: 'hover', type: 'string'}
    ];
  }

  constructor (el, data, options) {
    this.chart = vcharts.chart('scatter', {
      el: el,
      values: data,
      x: options.x,
      y: options.y,
      color: options.color,
      shape: options.shape,
      size: options.size,
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
