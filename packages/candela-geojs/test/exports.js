import test from 'tape-catch';

import candela from 'candela';

const components = [
  'Geo',
  'GeoDots'
];

test('Contents of candela-geojs micropackage', t => {
  candela.unregisterAll();
  require('candela-geojs');

  t.equal(Object.keys(candela.components).length, components.length, `candela-geojs exports ${components.length} component${components.length > 1 ? 's' : ''}`);

  components.forEach(comp => {
    t.ok(candela.components[comp], `candela.components.${comp} exists`);
    t.equal(typeof candela.components[comp], 'function', `candela.components.${comp} is a function`);
  });

  t.end();
});
