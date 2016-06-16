import candela from '../../../src/candela';
import html from './index.jade';
import iris from '../../examples/data/iris.json';

import '../../examples/index.styl';

window.onload = () => {
  document.body.innerHTML = html();

  let el = document.getElementById('vis-container')
    .appendChild(document.createElement('div'));
  el.setAttribute('id', 'vis-element');
  el.className = 'vis-full';

  let vis = new candela.components.ScatterPlot(el, {
    data: iris,
    x: 'petalLength',
    y: 'petalWidth',
    color: 'sepalLength',
    shape: 'species',
    width: 620,
    height: 500,
    padding: {
      top: 20,
      bottom: 80,
      left: 50,
      right: 130
    },
    renderer: 'svg'
  });
  vis.render();
};
