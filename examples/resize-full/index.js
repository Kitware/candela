import candela from 'candela';
import 'candela/dist/vega.min.js';
import 'candela/dist/mixin.min.js';

import html from './index.jade';
import './index.styl';

let data = [];
for (let i = 0; i < 100; i += 1) {
  data.push({x: Math.random(), y: Math.random()});
}

window.onload = () => {
  document.body.innerHTML = html();

  let el = document.getElementById('vis-element');
  let vis = new (candela.mixins.AutoResize(candela.mixins.InitSize(candela.components.ScatterPlot)))(el, {
    data,
    x: 'x',
    y: 'y'
  });
  console.log(`initial size: ${vis.width}, ${vis.height}`);
  vis.render();

  vis.on('resize', () => {
    console.log(`resize event: ${vis.width}, ${vis.height}`);
  });
};
