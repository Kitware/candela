import test from 'tape';
import vcharts from '..';

test('vcharts.transform() without spec', t => {
  t.deepEqual({}, vcharts.transform({}), 'object transform should be identity');
  t.deepEqual([], vcharts.transform([]), 'array transform should be identity');
  t.deepEqual('hi', vcharts.transform('hi'), 'string transform should be identity');
  t.deepEqual(1.2, vcharts.transform(1.2), 'number transform should be identity');
  t.deepEqual(true, vcharts.transform(true), 'boolean transform should be identity');
  t.deepEqual(null, vcharts.transform(null), 'null transform should be identity');

  let d = new Date('01-01-2012');
  t.deepEqual(d, vcharts.transform(d), 'Date object transform should be identity');

  let deeper = {
    a: [1, 2, 'abc'],
    b: {c: false},
    c: null
  };
  t.deepEqual(deeper, vcharts.transform(deeper), 'nested object transform should be identity');

  t.end();
});

test('vcharts.transform() with @get spec', t => {
  let spec = ['@get', 'a'];
  t.deepEqual(12, vcharts.transform(spec, {a: 12}), '@get spec should pick out field "a"');

  spec = ['@get', 'a', 5];
  t.deepEqual(5, vcharts.transform(spec, {b: 12}), '@get spec with default should return default value');

  spec = ['@get', 'a', 5];
  t.deepEqual(0, vcharts.transform(spec, {a: 0}), '@get spec with value should pick out value');
  t.deepEqual(false, vcharts.transform(spec, {a: false}), '@get spec with value should pick out value');
  t.deepEqual(5, vcharts.transform(spec, {a: undefined}), '@get spec with undefined value should return default');

  spec = ['@get', 'a', ['@eq', 5, 2]];
  t.deepEqual(false, vcharts.transform(spec, {b: 12}), '@get spec with expression default should evaluate the expression');

  spec = [['@get', 'a', 5], ['@get', 'a']];
  t.deepEqual([5, null], vcharts.transform(spec, {b: 12}), '@get spec should not reuse default values later');

  spec = [['@get', 'a', 5], ['@get', 'a']];
  let options = {b: 12};
  vcharts.transform(spec, options);
  t.deepEqual({b: 12}, options, '@get spec should not mutate options');

  spec = ['@get', ['@get', 'a']];
  t.deepEqual(10, vcharts.transform(spec, {a: 'b', b: 10}), '@get spec should allow computed names');

  t.end();
});

test('vcharts.transform() with @defaults spec', t => {
  var spec = [
    '@defaults',
    [['a.b', 5]],
    [['@get', 'a.b'], ['@get', 'a.d']]
  ];
  t.deepEqual([5, 1], vcharts.transform(spec, {a: {d: 1}}), '@defaults should allow nested defaulting on defined parent');

  spec = [
    '@defaults',
    [['a', 5]],
    ['@get', 'a']
  ];
  t.deepEqual(7, vcharts.transform(spec, {a: 7}), '@defaults should not override options');

  spec = [
    '@map',
    [1, 2, 3],
    'd',
    [
      '@defaults',
      [['d', 5]],
      ['@get', 'd']
    ]
  ];
  t.deepEqual([1, 2, 3], vcharts.transform(spec), '@defaults should not override values from current scope');

  spec = ['@defaults', [['a', 5]], ['@get', 'a']];
  t.deepEqual(0, vcharts.transform(spec, {a: 0}), '@defaults should not override defined value');
  t.deepEqual(false, vcharts.transform(spec, {a: false}), '@defaults should not override defined value');
  t.deepEqual(5, vcharts.transform(spec, {a: undefined}), '@defaults should override undefined value');

  spec = ['@defaults', [[['@get', 'a'], 10]], ['@get', 'b']];
  t.deepEqual(10, vcharts.transform(spec, {a: 'b'}), '@defaults spec should allow computed names');

  t.end();
});

test('vcharts.transform() with @let spec', t => {
  let spec = [
    '@let',
    [['a', {}], ['a.b', 5]],
    [['@get', 'a.b'], ['@get', 'a.d']]
  ];
  t.deepEqual([5, 1], vcharts.transform(spec, {a: {d: 1}}), '@let should allow nested defaulting on defined parent');

  spec = [
    '@let',
    [['a.b', 5]],
    ['@get', 'a.b']
  ];
  t.deepEqual(5, vcharts.transform(spec), '@let should allow nested defaulting on undefined parent');

  spec = [
    '@let',
    [['a', 5]],
    ['@get', 'a']
  ];
  t.deepEqual(5, vcharts.transform(spec, {a: 7}), '@let should override options');

  spec = [
    '@map',
    [1, 2, 3],
    'd',
    [
      '@let',
      [['d', 5]],
      ['@get', 'd']
    ]
  ];
  t.deepEqual([5, 5, 5], vcharts.transform(spec), '@let should override values from current scope');

  spec = ['@let', [[['@get', 'a'], 10]], ['@get', 'b']];
  t.deepEqual(10, vcharts.transform(spec, {a: 'b'}), '@let spec should allow computed names');

  t.end();
});

test('vcharts.transform() with @map spec', t => {
  let spec = ['@map', [1, 2, 3], 'd', ['@get', 'd']];
  t.deepEqual([1, 2, 3], vcharts.transform(spec), '@map should build an array');

  spec = ['@map', [1, null, 3], 'd', ['@get', 'd']];
  t.deepEqual([1, 3], vcharts.transform(spec), '@map should skip null values in outpus');

  spec = ['@map', null, 'd', ['@get', 'd']];
  t.deepEqual([], vcharts.transform(spec), '@map should send non-arrays to empty array');

  spec = ['@map', [1, null, 3], 'd', ['@get', 'd']];
  t.deepEqual([1, 3], vcharts.transform(spec), '@map should not add null array items');

  spec = ['@map', [1, 2, 3], 'd', {a: ['@get', 'd']}];
  t.deepEqual([{a: 1}, {a: 2}, {a: 3}], vcharts.transform(spec), '@map can produce complex objects');

  spec = [
    '@map',
    [1, 2, 3],
    'd',
    [
      '@map',
      ['a', 'b'],
      'dd',
      {
        d: ['@get', 'd'],
        dd: ['@get', 'dd']
      }
    ]
  ];
  t.deepEqual([
    [{d: 1, dd: 'a'}, {d: 1, dd: 'b'}],
    [{d: 2, dd: 'a'}, {d: 2, dd: 'b'}],
    [{d: 3, dd: 'a'}, {d: 3, dd: 'b'}]
  ], vcharts.transform(spec), '@map can nest');

  spec = ['@map', [1, 2, 3], 'd', ['@get', 'd']];
  let options = {b: 12};
  vcharts.transform(spec, options);
  t.deepEqual({b: 12}, options, '@map should not modify options');

  spec = ['@map', [1, 2, 3], 'd', ['@get', 'd']];
  options = {d: 12};
  t.deepEqual([1, 2, 3], vcharts.transform(spec, options), '@map should override option with loop variable');
  t.deepEqual({d: 12}, options, '@map should not modify options');

  t.end();
});

test('vcharts.transform() with @if spec', t => {
  var spec = ['@if', true, 10, 20];
  t.deepEqual(10, vcharts.transform(spec), '@if should choose first option when condition is true');

  spec = ['@if', false, 10, 20];
  t.deepEqual(20, vcharts.transform(spec), '@if should choose second option when condition is false');

  spec = ['@if', ['@get', 'a'], ['@get', 'b'], 20];
  t.deepEqual(5, vcharts.transform(spec, {a: true, b: 5}), '@if should work with subexpressions');

  spec = [
    ['@if', null, 10, 20],
    ['@if', undefined, 10, 20],
    ['@if', 0, 10, 20],
    ['@if', NaN, 10, 20],
    ['@if', '', 10, 20]
  ];
  t.deepEqual([20, 20, 20, 20, 20], vcharts.transform(spec), '@if should treat falsy values as false');

  t.end();
});

test('vcharts.transform() with @eq spec', t => {
  var spec = [
    ['@eq', {}, {}],
    ['@eq', 0, 0],
    ['@eq', 'abc', 'abc'],
    ['@eq', 1, '1'],
    ['@eq', null, null]
  ];
  t.deepEqual([false, true, true, false, true], vcharts.transform(spec), '@eq should test for JavaScript strict (===) equality');

  spec = [
    ['@eq', ['@get', 'a'], 10],
    ['@eq', ['@get', 'b'], ['@get', 'c']]
  ];
  t.deepEqual([true, true], vcharts.transform(spec, {a: 10, b: 5, c: 5}), '@eq should work with subexpressions');

  t.end();
});

test('vcharts.transform() with @lt spec', t => {
  var spec = [
    ['@lt', {}, {}],
    ['@lt', 0, 5],
    ['@lt', 'abc', 'abd'],
    ['@lt', null, null]
  ];
  t.deepEqual([false, true, true, false], vcharts.transform(spec), '@lt should test for JavaScript <');

  spec = [
    ['@lt', ['@get', 'a'], 15],
    ['@lt', ['@get', 'b'], ['@get', 'c']]
  ];
  t.deepEqual([true, false], vcharts.transform(spec, {a: 10, b: 5, c: 5}), '@lt should work with subexpressions');

  t.end();
});

test('vcharts.transform() with @gt spec', t => {
  var spec = [
    ['@gt', {}, {}],
    ['@gt', 0, -5],
    ['@gt', 'abc', 'abb'],
    ['@gt', null, null]
  ];
  t.deepEqual([false, true, true, false], vcharts.transform(spec), '@gt should test for JavaScript <');

  spec = [
    ['@gt', ['@get', 'a'], 5],
    ['@gt', ['@get', 'b'], ['@get', 'c']]
  ];
  t.deepEqual([true, false], vcharts.transform(spec, {a: 10, b: 5, c: 5}), '@gt should work with subexpressions');

  t.end();
});

test('vcharts.transform() with @length spec', t => {
  var spec = [
    ['@length', [1, 2, 3]],
    ['@length', 'hello'],
    ['@length', 2],
    ['@length', {a: 1, b: 2}],
    ['@length', null]
  ];
  t.deepEqual([3, 5, 0, 0, 0], vcharts.transform(spec), '@length returns length of strings and arrays, 0 for other types');

  t.end();
});

test('vcharts.transform() with @join spec', t => {
  let spec = [
    '@join', ',', ['a', 'b', 'c', 'd']
  ];
  t.equal('a,b,c,d', vcharts.transform(spec), '@join should join strings');

  spec = ['@join', ',', null];
  t.equal('', vcharts.transform(spec), '@join should send non-arrays to the empty string');

  t.end();
});

test('vcharts.transform() with @orient spec', t => {
  var spec = [
    '@orient',
    'horizontal',
    {x: 1, y: 2, yc: 3, width: 5}
  ];
  t.deepEqual({x: 1, y: 2, yc: 3, width: 5}, vcharts.transform(spec), '@orient should leave horizontal specs unchanged');

  spec = [
    '@orient',
    'vertical',
    {x: 1, y: 2, yc: 2, width: 5, hello: 10}
  ];
  t.deepEqual({y: 1, x: 2, xc: 2, height: 5, hello: 10}, vcharts.transform(spec), '@orient should re-orient vertical specs and leave other props');

  t.end();
});

test('vcharts.transform() with @axis spec', t => {
  let data = [
    {a: 1, b: 'Mar 1 2012', c: '10'},
    {a: 13, b: 'Mar 10 2012', c: '14'}
  ];

  let spec = [
    '@axis',
    { data: data, field: 'a' }
  ];
  t.deepEqual(vcharts.transform(spec).axes[0].formatType, 'number', '@axis should detect numeric');

  spec = [
    '@axis',
    { data: data, field: 'b' }
  ];
  t.deepEqual(vcharts.transform(spec).axes[0].formatType, 'time', '@axis should detect time from string');

  spec = [
    '@axis',
    { data: data, field: 'c' }
  ];
  t.deepEqual(vcharts.transform(spec).axes[0].formatType, 'number', '@axis should detect number from string');

  data = [
    {b: 'Mar 1 2012', c: '10'},
    {b: 'Mar 10 2012', c: '14'}
  ];
  data.__types__ = {'b': 'string', 'c': 'string'};

  spec = [
    '@axis',
    { data: ['@get', 'data'], field: 'b' }
  ];
  t.deepEqual(vcharts.transform(spec, {data: data}).axes[0].formatType, 'string', '@axis should respect __types__ to override date');

  spec = [
    '@axis',
    { data: ['@get', 'data'], field: 'c' }
  ];
  t.deepEqual(vcharts.transform(spec, {data: data}).axes[0].formatType, 'string', '@axis should respect __types__ to override number');

  t.end();
});

test('vcharts.transform() with @merge spec', t => {
  var spec = [
    '@merge',
    {a: 1},
    {b: 2},
    {c: 3}
  ];
  t.deepEqual({a: 1, b: 2, c: 3}, vcharts.transform(spec), '@merge should merge objects');

  spec = [
    '@merge',
    {a: [1]},
    {a: []},
    {a: [2, 3]}
  ];
  t.deepEqual({a: [1, 2, 3]}, vcharts.transform(spec), '@merge should merge arrays');

  spec = [
    '@merge',
    {a: [1]},
    {a: 'b'}
  ];
  t.deepEqual({a: [1]}, vcharts.transform(spec), '@merge should favor first occurrence on duplicate keys');

  spec = [
    '@merge',
    {a: 'b'},
    {a: [1]}
  ];
  t.deepEqual({a: 'b'}, vcharts.transform(spec), '@merge should favor first occurrence on duplicate keys');

  spec = [
    '@merge',
    {
      a: null,
      b: undefined
    },
    {a: 'a', b: 'b'}
  ];
  t.deepEqual({a: 'a', b: 'b'}, vcharts.transform(spec), '@merge should favor non-null, non-undefined values');
  spec = [
    '@merge',
    {a: 'a', b: 'b'},
    {
      a: null,
      b: undefined
    }
  ];
  t.deepEqual({a: 'a', b: 'b'}, vcharts.transform(spec), '@merge should favor non-null, non-undefined values');

  t.end();
});
