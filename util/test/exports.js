import test from 'tape-catch';

import candela from '../..';

const requireBuilt = require.context('../../dist', false, /\.js$/);

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

const testBundle = (bundle, title, cond, runTests) => {
  test(title, t => {
    if (cond) {
      let built = requireBuilt(`./${bundle}`);
      t.ok(built, `The bundle ${bundle} exists`);
      runTests(t, built);
    } else {
      t.fail(`Bundle file ${bundle} does not exist (run \`npm run build\` to build it)`);
    }

    t.end();
  });
};

testBundle('candela.js', 'Structure and content of unminified Candela library file', !CANDELA_JS_MISSING, structureTests);
testBundle('candela.min.js', 'Structure and content of minified Candela library file', !CANDELA_MIN_JS_MISSING, structureTests);
