import test from 'tape-catch';

import candela from '../..';

function structureTests (t, cd) {
  t.ok(cd, 'candela exists');

  t.ok(cd.components, 'candela.components exists');
  t.equal(typeof cd.components, 'object', 'candela.components is an object');

  t.ok(cd.register, 'candela.register exists');
  t.equal(typeof cd.register, 'function', 'candela.register is a function');

  t.ok(cd.unregister, 'candela.unregister exists');
  t.equal(typeof cd.unregister, 'function', 'candela.unregister is a function');

  t.ok(cd.unregisterAll, 'candela.unregisterAll exists');
  t.equal(typeof cd.unregisterAll, 'function', 'candela.unregisterAll is a function');

  t.ok(cd.mixins, 'candela.mixins exists');
  t.equal(typeof cd.mixins, 'object', 'candela.mixins is an object');

  t.ok(cd.registerMixin, 'candela.registerMixin exists');
  t.equal(typeof cd.registerMixin, 'function', 'candela.registerMixin is a function');

  t.ok(cd.unregisterMixin, 'candela.unregisterMixin exists');
  t.equal(typeof cd.unregisterMixin, 'function', 'candela.unregisterMixin is a function');

  t.ok(cd.unregisterMixinAll, 'candela.unregisterMixinAll exists');
  t.equal(typeof cd.unregisterMixinAll, 'function', 'candela.unregisterMixinAll is a function');

  t.ok(cd.VisComponent, 'candela.VisComponent exists');
  t.equal(typeof cd.VisComponent, 'function', 'candela.VisComponent is a function');

  t.equal(Object.keys(cd).length, 9, 'candela contains no other members');
}

test('Structure and content of exported Candela library object', t => {
  structureTests(t, candela);
  t.end();
});

test('Structure and content of unminified Candela library file', t => {
  if (!CANDELA_JS_MISSING) {
    let candelaBuilt = require('../../dist/candela.js');
    t.ok(candelaBuilt, 'The built candela.js file exists');

    if (candelaBuilt) {
      structureTests(t, candelaBuilt);
    }
  } else {
    t.fail('Built candela.js file does not exist (run `npm run build` to build it)');
  }

  t.end();
});

test('Structure and content of minified Candela library file', t => {
  if (!CANDELA_MIN_JS_MISSING) {
    let candelaBuilt = require('../../dist/candela.min.js');
    t.ok(candelaBuilt, 'The built candela.min.js file exists');

    if (candelaBuilt) {
      structureTests(t, candelaBuilt);
    }
  } else {
    t.fail('Built candela.min.js file does not exist (run `npm run build` to build it)');
  }

  t.end();
});
