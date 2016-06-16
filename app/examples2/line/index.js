import candela from '../../../src/candela';
import dl from 'datalib';
import html from './index.jade';
import msft_raw from '../../examples/data/msft.csv';

import '../../examples/index.styl';

const msft = dl.read(msft_raw, {
  type: 'csv',
  parse: 'auto'
});

window.onload = () => {
  document.body.innerHTML = html();

  let el = document.getElementById('vis-container')
    .appendChild(document.createElement('div'));
  el.setAttribute('id', 'vis-element');
  el.className = 'vis-full';

  let vis = new candela.components.LineChart(el, {
    data: msft,
    x: 'date',
    y: ['price'],
    width: 735,
    height: 535,
    padding: {
      top: 20,
      bottom: 45,
      left: 45,
      right: 20
    },
    renderer: 'svg'
  });
  vis.render();
};
