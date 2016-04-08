import LineChart from './../../../../src/candela/components/LineChart';
import $ from 'jquery';
import './index.styl';

let el = document.getElementById('vcharts-line');

let data = [];

for (let i = 0; i < 20; i++) {
  data.push([i, Math.random() * 10]);
}

let vis = new LineChart(el, data);
vis.render();

// Every second, add a random data point to the chart, and remove the oldest
// data point.
let counter = data.length;
window.setInterval(function () {
  data.push([counter, Math.random() * 10]);
  data = data.slice(1);

  counter++;

  vis.data(data);
  vis.render();
}, 1000);

// Whenever the component renders, change the number of updates in the DOM.
vis.on('render', function () {
  $('#counter').text(counter - data.length);
});
