import test from 'tape-catch';

import candela from '../candela';

function structureTests (t, cd) {
  t.ok(cd, 'candela exists');

  t.ok(cd.VisComponent, 'candela.VisComponent exists');

  t.ok(cd.VisComponent.VisComponent, 'candela.VisComponent.VisComponent exists');
  t.equal(typeof cd.VisComponent.VisComponent, 'function', 'candela.VisComponent.VisComponent is a function');

  t.ok(cd.components, 'candela.components exists');
}

test('Structure and content of exported Candela library object', t => {
  structureTests(t, candela);
  t.end();
});

test('Structure and content of unminified Candela library file', t => {
  try {
    let candelaBuilt = require('../dist/candela.js');
    t.ok(candelaBuilt, 'The built candela.js file exists');

    if (candelaBuilt) {
      structureTests(t, candelaBuilt);
    }
  } catch (e) {
    t.skip('Built candela.js file does not exist');
  }

  t.end();
});
