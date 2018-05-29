import { select } from 'd3-selection';
import test from 'tape-catch';

import ScatterPlotMatrix from '..';

test('ScatterPlot component', t => {
  const data = [...Array(20).keys()].map(i => ({
    a: i / 2,
    b: i * i,
    c: i,
    d: -i * i * i
  }));
  const width = 400;
  const height = 400;
  const fields = ['a', 'b', 'c', 'd'];

  let el = document.createElement('div');
  let vis = new ScatterPlotMatrix(el, {
    data,
    fields,
    color: 'c',
    width,
    height,
    renderer: 'svg'
  });
  vis.render();

  const plots = select(vis.el)
    .selectAll('.mark-group.role-scope')
    .nodes();
  t.equal(plots.length, fields.length * fields.length, 'Plot contains correct number of subplots');

  const points = select(vis.el)
    .select('.mark-symbol.role-mark')
    .selectAll('path')
    .nodes();
  t.equal(points.length, data.length, 'Subplot has the correct number of data marks');

  t.end();
});
