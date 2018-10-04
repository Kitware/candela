import test from 'tape-catch';

import { minmax } from '..';

test('minmax() exists', t => {
  t.ok(minmax, 'minmax was imported successfully');
  t.equal(typeof minmax, 'function', 'minmax is a function');

  t.end();
});

test('minmax() works on empty list', t => {
  const range = minmax([]);
  t.equal(range.min, null, 'min should be null');
  t.equal(range.max, null, 'max should be null');

  t.end();
});

test('minmax() works on non-empty numeric list', t => {
  const range = minmax([7.3, 1.2, 3.14, 47, -1, 0, 47, 1.2, 43.43]);
  t.equal(range.min, -1, 'minimum found successfully');
  t.equal(range.max, 47, 'maximum found successfully');

  t.end();
});
