import test from 'tape-catch';

import candela from 'candela';

// Create a require context consisting only of index.js files found in the
// top-level of any node_modules package starting with "candela-". This is
// needed to allow the exportTest() function to accept a package name at
// runtime.
const ctx = require.context('../..', true, /\/candela-[^\/]*\/index\.js$/);

export default function exportTest (packageName, components) {
  test(`Contents of ${packageName} micropackage`, t => {
    candela.unregisterAll();
    ctx(`./${packageName}/index.js`);

    t.equal(Object.keys(candela.components).length, components.length, `${packageName} exports ${components.length} component${components.length > 1 ? 's' : ''}`);

    components.forEach(comp => {
      t.ok(candela.components[comp], `candela.components.${comp} exists`);
      t.equal(typeof candela.components[comp], 'function', `candela.components.${comp} is a function`);
    });

    t.end();
  });
}
