import test from 'tape-catch';

import candela from '..';

// Create a require context consisting only of index.js files found in the
// top-level of any node_modules package starting with "candela-". This is
// needed to allow the exportTest() function to accept a package name at
// runtime.
const ctx = require.context('../packages', true, /\/candela-[^\/]*\/index\.js$/);

export default function exportMixinTest (packageName, mixins) {
  test(`Contents of ${packageName} micropackage`, t => {
    candela.unregisterMixinAll();
    ctx(`./${packageName}/index.js`);

    t.equal(Object.keys(candela.mixins).length, mixins.length, `${packageName} exports ${mixins.length} mixin${mixins.length > 1 ? 's' : ''}`);

    mixins.forEach(comp => {
      t.ok(candela.mixins[comp], `candela.mixins.${comp} exists`);
      t.equal(typeof candela.mixins[comp], 'function', `candela.mixins.${comp} is a function`);
    });

    t.end();
  });
}
