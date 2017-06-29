import test from 'tape-catch';

import candela from '..';

// Create a require context consisting only of load.js files found in the
// plugins directory.  This is needed to allow the exportTest() function to
// accept a package name at runtime.
const ctx = require.context('../plugins', true, /\/[^\/]*\/load\.js$/);

export const contentTests = (t, container, components, prefix) => {
  components.forEach(comp => {
    t.ok(container[comp], `${prefix}.${comp} exists`);
    t.equal(typeof container[comp], 'function', `${prefix}.${comp} is a function`);
  });
  t.equal(Object.keys(container).length, components.length, `${prefix} contains no other elements`);
};

export const exportTest = (packageName, components) => {
  test(`Contents of ${packageName} plugin`, t => {
    candela.unregisterAll();
    ctx(`./${packageName}/load.js`);

    t.equal(Object.keys(candela.components).length, components.length, `${packageName} exports ${components.length} component${components.length > 1 ? 's' : ''}`);

    contentTests(t, candela.components, components, 'candela.components');

    t.end();
  });
};

export const exportMixinTest = (packageName, mixins) => {
  test(`Contents of ${packageName} plugin`, t => {
    candela.unregisterMixinAll();
    ctx(`./${packageName}/load.js`);

    t.equal(Object.keys(candela.mixins).length, mixins.length, `${packageName} exports ${mixins.length} mixin${mixins.length > 1 ? 's' : ''}`);

    contentTests(t, candela.mixins, mixins, 'candela.mixins');

    t.end();
  });
};
