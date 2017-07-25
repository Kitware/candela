import candela from 'candela';
import 'candela/plugins/vega/load';
import 'candela/plugins/mixin/load';

import { changeset } from 'vega';
import { select } from 'd3-selection';
import html from './index.jade';
import './index.styl';

class DynamicLineChart extends candela.mixins.Events(candela.components.LineChart) {
  constructor (...args) {
    super(...args);
  }

  render () {
    super.render();
    this.emit('render');
  }

  data (data) {
    this.options.data = data;
    this.view.change('source_0', changeset().remove(() => true).insert(this.options.data)).run();
  }
}

let data = [];
for (let i = 0; i < 20; i++) {
  data.push({
    index: i,
    value: Math.random() * 10
  });
}

window.onload = () => {
  document.body.innerHTML = html();

  let el = document.getElementById('vcharts-line');

  let vis = new DynamicLineChart(el, {
    data,
    x: 'index',
    y: 'value'
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
    select('#counter')
      .text(counter - data.length);
  });
};
