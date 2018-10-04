import { select } from 'd3-selection';
import test from 'tape-catch';

// needed to handle Babel's conversion of for `(x of array)`
// import 'babel-polyfill';

import LineUp from '..';

test('LineUp component', t => {
  const div = document.createElement('div');
  div.setAttribute('style', 'width: 800px; height: 600px');
  document.body.appendChild(div);

  t.ok(LineUp, 'LineUp exists');
  t.ok(LineUp.options, 'LineUp options exists');
  let lu = new LineUp(div, {
    data: [
      {a: 1, b: 2, c: 'a', d: true},
      {a: 3, b: 4, c: 'b', d: false},
      {a: -1, b: 0, c: 'c', d: false}
    ],
    fields: ['d', 'a', 'c'],
    stacked: true,
    histograms: true,
    animation: false
  });
  t.ok(lu.lineUpConfig, 'LineUp configured');
  t.equal(lu.lineUpConfig.renderingOptions.histograms, true, 'LineUp options set');
  lu.render();
  t.ok(lu.lineupInstances.main, 'LineUp rendered');
  // still need to add tests for dragging columns and recording their weights,
  // tooltip updates, select callback, and date-based columns

  window.setTimeout(() => {
    const rows = select(lu.el)
      .selectAll('g.row')
      .nodes();
    t.assert(rows.length > 0, 'Plot has rendered some data rows');

    t.end();
  }, 200);
});
