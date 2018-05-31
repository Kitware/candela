import { select } from 'd3-selection';
import test from 'tape-catch';

import ScatterPlot from '..';

test('ScatterPlot component', t => {
  const data = [...Array(20).keys()].map(i => ({
    a: i / 2,
    b: i * i,
    c: i
  }));
  const width = 400;
  const height = 400;

  let el = document.createElement('div');
  let vis = new ScatterPlot(el, {
    data,
    x: 'a',
    y: 'b',
    color: 'c',
    width,
    height,
    renderer: 'svg'
  });
  vis.render();

  const marks = select(vis.el)
    .select('.mark-symbol.role-mark.marks')
    .selectAll('path')
    .nodes();
  t.equal(marks.length, 20, 'Plot has the correct number of data marks');

  t.end();
});
