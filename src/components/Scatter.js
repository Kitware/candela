import vcharts from '../external/vcharts/src';

export default class Scatter {
  static get options () {
    return [
      {name: 'data', type: 'table'},
      {name: 'x', type: 'string'},
      {name: 'y', type: 'string'},
      {name: 'color', type: 'string'}
    ];
  }

  constructor (el, data, options) {
    this.chart = vcharts.chart('xy', {
      el: el,
      series: [{
        name: 'values',
        values: data,
        x: options.x,
        y: options.y
      }],
      xAxis: {
        title: options.x
      },
      yAxis: {
        title: options.y
      },
      legend: false
    });
  }

  render () {
    this.chart.update();
  }
}
