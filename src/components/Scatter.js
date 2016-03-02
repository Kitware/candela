import VisualizationComponent from '../core/VisualizationComponent';
import vcharts from '../external/vcharts/src';

export default class Scatter extends VisualizationComponent {
  static get options () {
    return [
      {
        name: 'x',
        type: 'number',
        selector: ['field']
      },

      {
        name: 'y',
        type: 'number',
        selector: ['field']
      },

      {
        name: 'color',
        type: 'string',
        selector: ['field', 'text']
      },

      {
        name: 'default color',
        type: 'string',
        selector: ['color', 'text']
      }
    ];
  }

  constructor (el, data, options) {
    super(el);

    this.data = data;

    this.options = Object.assign({}, options);

    this.options.x = this.options.x || 'x';
    this.options.y = this.options.y || 'y';

    this.options.defaultColor = this.options.defaultColor || 'steelblue';

    this.chart = vcharts.chart('xy', {
      el,
      series: [
        {
          name: 'values'
        }
      ]
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
      legend: false
    });
  }

  // TODO: the following "set*()" methods should be automatically generated from
  // the options getter at construction time (probably in
  // VisualizationComponent).
  setX (x) {
    this.options.x = x;
  }

  setY (y) {
    this.options.y = y;
  }

  setColor (color) {
    this.options.color = color;
  }

  setDefaultColor (color) {
    this.options.defaultColor = color;
  }
}
