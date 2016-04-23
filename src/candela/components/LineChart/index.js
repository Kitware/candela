import VisComponent from '../../VisComponent';
import Events from '../../VisComponent/mixin/Events';
import vega from '../../util/vega';
import spec from './spec.json';

export default class LineChart extends Events(VisComponent) {
  constructor (el, data) {
    super(el, data);

    let values = data.map(x => x[1]);

    let minY = Math.min(...values);
    if (minY === -Infinity) {
      minY = 0;
    }
    this.minY = minY;

    let maxY = Math.max(...values);
    if (maxY === Infinity) {
      maxY = 0;
    }

    maxY += (maxY - minY) * 0.20;
    this.maxY = maxY;

    this.render();
  }

  data (data) {
    this.options = data;
    this.render();
  }

  render () {
    vega.parseChart(spec, this.el, {
      series: [
        {
          name: 'series1',
          values: this.options,
          x: '0',
          y: '1',
          color: 'darkslategray',
          line: true,
          point: true
        }
      ],
      xAxis: {
        title: 'X',
        type: 'time'
      },
      yAxis: {
        title: 'Y',
        zoom: false,
        pan: false,
        domain: [this.minY, this.maxY]
      },
      padding: {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100
      }
    });
    this.emit('render');
  }
}
