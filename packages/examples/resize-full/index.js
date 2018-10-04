import { ScatterPlot } from '@candela/vega';
import { AutoResize } from '@candela/size';
import html from './index.jade';
import './index.styl';

let data = [];
for (let i = 0; i < 100; i += 1) {
  data.push({x: Math.random(), y: Math.random()});
}

window.onload = () => {
  document.body.innerHTML = html();

  let el = document.getElementById('vis-element');
  let vis = new (AutoResize(ScatterPlot))(el, {
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
