import test from 'tape';

import candela from '..';

test('Structure and content of exported Candela library object', t => {
  t.ok(candela, 'candela exists');

  t.ok(candela.VisComponent, 'candela.VisComponent exists');

  t.ok(candela.VisComponent.VisComponent, 'candela.VisComponent.VisComponent exists');
  t.equal(typeof candela.VisComponent.VisComponent, 'function', 'candela.VisComponent.VisComponent is a function');

  t.ok(candela.components, 'candela.components exists');

  t.ok(candela.components.Histogram, 'candela.components.Histogram exists');
  t.equal(typeof candela.components.Histogram, 'function', 'candela.components.Histogram is a function');

  t.ok(candela.components.ParallelCoordinates, 'candela.components.ParallelCoordinates exists');
  t.equal(typeof candela.components.ParallelCoordinates, 'function', 'candela.components.ParallelCoordinates is a function');

  t.ok(candela.components.Scatter, 'candela.components.Scatter exists');
  t.equal(typeof candela.components.Scatter, 'function', 'candela.components.Scatter is a function');

  t.ok(candela.components.ScatterMatrix, 'candela.components.ScatterMatrix exists');
  t.equal(typeof candela.components.ScatterMatrix, 'function', 'candela.components.ScatterMatrix is a function');

  t.end();
});
