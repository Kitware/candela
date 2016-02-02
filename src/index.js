import Dummy from './components/Dummy';
import LineChart from './components/VCharts';
import './components/ParallelCoordinates';
import $ from 'jquery';

function dummy () {
  let el = document.getElementById('raw');

  let data = [
    {
      text: 'one, two',
      color: 'blue'
    },

    {
      text: 'buckle my shoe',
      color: 'green'
    }
  ];

  let vis = new Dummy(el, data);

  window.setTimeout(() => {
    data = [
      {
        text: 'three, four',
        color: 'red'
      },

      {
        text: 'open the door',
        color: 'chartreuse'
      }
    ];

    vis.refresh(data);
  }, 1000);
}

function linechart () {
  let el = document.getElementById('vcharts-line');

  let data = {
    values: []
  };

  for (let i = 0; i < 1000; i++) {
    data.values.push([i, Math.random() * 10]);
  }

  let vis = new LineChart(el, data);
  vis.refresh();
}

import indexContent from './jade/index.jade';
import './styl/index.styl';

window.onload = () => {
  $('body').html(indexContent());

  dummy();
  linechart();
};
