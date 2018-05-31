import { select } from 'd3-selection';
import test from 'tape-catch';

import LineChart from '..';

test('LineChart component', t => {
  const data = [...Array(20).keys()].map(i => ({
    a: i,
    b: i * i
  }));
  const width = 400;
  const height = 400;

  let el = document.createElement('div');
  let vis = new LineChart(el, {
    data,
    x: 'a',
    y: 'b',
    width,
    height,
    renderer: 'svg'
  });
  vis.render();

  let lines = select(vis.el)
    .select('.mark-line.role-mark')
    .nodes();
  t.equal(lines.length, 1, 'Plot should have one line element');

  t.end();
});
