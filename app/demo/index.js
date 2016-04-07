import LineChart from './../../src/candela/components/LineChart';
import ParallelCoordinates from './../../src/candela/components/ParallelCoordinates';
import Scatter from './../../src/candela/components/Scatter';
import $ from 'jquery';

function linechart () {
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
}

function parallelCoordinates () {
  let el = document.getElementById('parallel-coords');

  let data = [
    'games',
    'age',
    'free throw percent',
    'minutes',
    'versatility index'
  ];

  let vis = new ParallelCoordinates(el, 'nba-heatmaps', 540, 360);
  vis.data(data);
  vis.render(data);
}

function scatterplot () {
  let el = document.getElementById('scatter');

  let data = [0, 1, 2, 3, 4, 5].map((v) => ({
    x: v,
    y: v * v
  }));

  let vis = new Scatter(el, data, {
    color: 'firebrick'
  });
  vis.render();
}

import indexContent from './index.jade';
import './index.styl';

window.onload = () => {
  $('body').html(indexContent());

  linechart();
  parallelCoordinates();
  scatterplot();
};
