import LineChart from './../../../../src/candela/components/LineChart';
import Events from './../../../../src/candela/VisComponent/mixin/Events';
import $ from 'jquery';
import './index.styl';

class DynamicLineChart extends Events(LineChart) {
  constructor (...args) {
    super(...args);
  }

  render () {
    super.render();
    this.emit('render');
  }

  data (data) {
    this.options.data = data;
  }
}

let el = document.getElementById('vcharts-line');

let data = [];

for (let i = 0; i < 20; i++) {
  data.push({
    index: i,
    value: Math.random() * 10
  });
}

let vis = new DynamicLineChart(el, {
  data,
  x: 'index',
  y: ['value']
});
vis.render();

// Every second, add a random data point to the chart, and remove the oldest
// data point.
let counter = data.length;
window.setInterval(function () {
  data.push({
    index: counter,
    value: Math.random() * 10
  });
  data = data.slice(1);

  counter++;

  vis.data(data);
  vis.render();
}, 1000);

// Whenever the component renders, change the number of updates in the DOM.
vis.on('render', function () {
  $('#counter').text(counter - data.length);
});
