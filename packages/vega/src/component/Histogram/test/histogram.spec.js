import { select } from 'd3-selection';
import test from 'tape-catch';

import Histogram from '..';

test('Histogram component', t => {
  const data = [...Array(200).keys()].map(i => ({
    a: Math.floor(i / 10)
  }));
  const width = 400;
  const height = 400;
  const maxBins = 10;

  // Count how many "classes" there are -- each one will be represented by a
  // rect mark.
  let classes = new Set();
  data.forEach(d => {
    classes.add(d.a);
  });

  let el = document.createElement('div');
  let vis = new Histogram(el, {
    data,
    x: 'a',
    maxBins,
    width,
    height,
    renderer: 'svg'
  });
  vis.render();

  const bars = select(vis.el)
    .select('.mark-rect.role-mark.marks')
    .selectAll('path')
    .nodes();
  t.equal(bars.length, classes.size, 'Plot has correct number of bin marks');

  t.end();
});
