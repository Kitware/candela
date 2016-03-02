import VisualizationComponent from '../core/VisualizationComponent';
import vcharts from '../external/vcharts/src';

export default class Scatter extends VisualizationComponent {
  static get options () {
    return [
      {name: 'data', type: 'table'},
      {name: 'x', type: 'string'},
      {name: 'y', type: 'string'},
      {name: 'color', type: 'string'}
    ];
  }

  constructor (el, data, options) {
    super(el);

    this.data = data;

    this.options = Object.assign({}, options);

    this.options.x = this.options.x || 'x';
    this.options.y = this.options.y || 'y';

    this.options.color = this.options.color || 'steelblue';

    this.chart = vcharts.chart('xy', {
      el: el,
      series: [{
        name: 'values',
        values: this.data,
        x: this.options.x,
        y: this.options.y,
        color: this.options.color
      }],
      xAxis: {
        title: this.options.x
      },
      yAxis: {
        title: this.options.y
      },
      legend: false
    });

    window.onresize = () => this.render();
  }

  render () {
    this.chart.update({
      series: [{
        name: 'values',
        values: this.data,
        x: this.options.x,
        y: this.options.y,
        color: this.options.color
      }],
      xAxis: {
        title: this.options.x
      },
      yAxis: {
        title: this.options.y
      },
      color: this.options.color,
      legend: false
    });
  }
}
