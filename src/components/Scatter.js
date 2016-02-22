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

  constructor (el, options) {
    let chart = vcharts.chart('xy', {
      el: el,
      series: [{
        name: 'values',
        values: options.data,
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
    window.onresize = () => chart.update();
  }
}
