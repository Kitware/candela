import candela from './../../../../src/candela';
import AutoResize from './../../../../src/candela/VisComponent/mixin/AutoResize';
import InitSize from './../../../../src/candela/VisComponent/mixin/InitSize';
import './index.styl';

let data = [];
for (let i = 0; i < 100; i += 1) {
  data.push({x: Math.random(), y: Math.random()});
}

let el = document.getElementById('vis-element');
let vis = new (AutoResize(InitSize(candela.components.Scatter)))(el, {
  data,
  x: 'x',
  y: 'y'
});
console.log(`initial size: ${vis.width}, ${vis.height}`);
vis.render();

vis.on('resize', () => {
  console.log(`resize event: ${vis.width}, ${vis.height}`);
});
