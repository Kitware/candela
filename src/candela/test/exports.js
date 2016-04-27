import test from 'tape';

import candela from '..';

function structureTests (t, cd) {
  t.ok(cd, 'candela exists');

  t.ok(cd.VisComponent, 'candela.VisComponent exists');

  t.ok(cd.VisComponent.VisComponent, 'candela.VisComponent.VisComponent exists');
  t.equal(typeof cd.VisComponent.VisComponent, 'function', 'candela.VisComponent.VisComponent is a function');

  t.ok(cd.components, 'candela.components exists');

  t.ok(cd.components.Histogram, 'candela.components.Histogram exists');
  t.equal(typeof cd.components.Histogram, 'function', 'candela.components.Histogram is a function');

  t.ok(cd.components.ParallelCoordinates, 'candela.components.ParallelCoordinates exists');
  t.equal(typeof cd.components.ParallelCoordinates, 'function', 'candela.components.ParallelCoordinates is a function');

  t.ok(cd.components.Scatter, 'candela.components.Scatter exists');
  t.equal(typeof cd.components.Scatter, 'function', 'candela.components.Scatter is a function');

  t.ok(cd.components.ScatterMatrix, 'candela.components.ScatterMatrix exists');
  t.equal(typeof cd.components.ScatterMatrix, 'function', 'candela.components.ScatterMatrix is a function');
}

test('Structure and content of exported Candela library object', t => {
  structureTests(t, candela);
  t.end();
});

test('Structure and content of unminified Candela library file', t => {
  try {
    let candelaBuilt = require('../../../build/candela/candela.js');
    t.ok(candelaBuilt, 'The built candela.js file exists');

    if (candelaBuilt) {
      structureTests(t, candelaBuilt);
    }
  } catch(e) {
    t.fail(`Could not import built candela.js: ${e}`);
  }

  t.end();
});
