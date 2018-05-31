import { select } from 'd3-selection';
import test from 'tape-catch';

import NormalProbabilityPlot from '..';

function getY (txt) {
  return +txt.split(',')[1].slice(0, -1);
}

test('NormalProbabilityPlot component', t => {
  const data = [...Array(100).keys()].map(i => i % 2 === 0 ? i / 2 : 100 - Math.floor(i / 2));
  const width = 400;
  const height = 400;

  let el = document.createElement('div');
  let vis = new NormalProbabilityPlot(el, {
    data,
    width,
    height,
    renderer: 'svg'
  });
  vis.render();

  const dotY = select(vis.el)
    .select('.mark-symbol.role-mark.marks')
    .selectAll('path')
    .nodes()
    .map((el) => getY(el.getAttribute('transform')));

  const sorted = [...dotY].sort((x, y) => y - x);

  t.deepEqual(sorted, dotY, 'Points should be plotted in ascending-y order');

  t.end();
});
