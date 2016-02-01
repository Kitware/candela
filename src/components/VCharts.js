import { VisualizationComponent } from './../resplendent';
import * as vcharts from 'vcharts';

console.log(vcharts);

class LineChart extends VisualizationComponent {
  constructor (div, data) {
    super(div, data);

    // let vcharts = require('vcharts');
    // console.log(vcharts);

    let values = data.values.map((x) => x[1]);

    let minY = Math.min(...values);
    if (minY === -Infinity) {
      minY = 0;
    }

    let maxY = Math.max(...values);
    if (maxY === Infinity) {
      maxY = 0;
    }

    maxY += (maxY - minY) * 0.20;

    this.chart = vcharts.chart('xy', {
      el: div,
      series: [
        {
          name: 'series1',
          values: data.values,
          x: '0',
          y: '1',
          color: 'blue',
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
        domain: [minY, maxY]
      },
      padding: {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100
      }
    });
  }

  refresh (data) {
    this.chart.update();
  }
}

export { LineChart };
