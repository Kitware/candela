import test from 'tape';
import vcharts from '../src';

test('transform - base - should pass through basic structures', t => {
  t.deepEqual({}, vcharts.transform({}));
  t.deepEqual([], vcharts.transform([]));
  t.deepEqual('hi', vcharts.transform('hi'));
  t.deepEqual(1.2, vcharts.transform(1.2));
  t.deepEqual(true, vcharts.transform(true));
  t.deepEqual(null, vcharts.transform(null));

  t.end();
});

test('transform - base - should pass through deeper objects', t => {
  var deeper = {
    a: [1, 2, 'abc'],
    b: {c: false},
    c: null
  };
  t.deepEqual(deeper, vcharts.transform(deeper));

  t.end();
});

test('transform - @get - should lookup values', t => {
  var spec = ['@get', 'a'];
  t.deepEqual(12, vcharts.transform(spec, {a: 12}));

  t.end();
});

test('transform - @get - should default values', t => {
  var spec = ['@get', 'a', 5];
  t.deepEqual(5, vcharts.transform(spec, {b: 12}));

  t.end();
});

test('transform - @get - should only override undefined values', t => {
  var spec = ['@get', 'a', 5];
  t.deepEqual(0, vcharts.transform(spec, {a: 0}));
  t.deepEqual(false, vcharts.transform(spec, {a: false}));
  t.deepEqual(5, vcharts.transform(spec, {a: undefined}));

  t.end();
});

test('transform - @get - should evaluate default values', t => {
  var spec = ['@get', 'a', ['@eq', 5, 2]];
  t.deepEqual(false, vcharts.transform(spec, {b: 12}));

  t.end();
});

test('transform - @get - should not reuse default values later', t => {
  var spec = [['@get', 'a', 5], ['@get', 'a']];
  t.deepEqual([5, null], vcharts.transform(spec, {b: 12}));

  t.end();
});

test('transform - @get - should not modify options', t => {
  var spec = [['@get', 'a', 5], ['@get', 'a']];
  var options = {b: 12};
  vcharts.transform(spec, options);
  t.deepEqual({b: 12}, options);

  t.end();
});

test('transform - @defaults - should allow nested defaulting on defined parent', t => {
  var spec = [
    '@defaults',
    [['a.b', 5]],
    [['@get', 'a.b'], ['@get', 'a.d']]
  ];
  t.deepEqual([5, 1], vcharts.transform(spec, {a: {d: 1}}));

  t.end();
});

test('transform - @defaults - should allow nested defaulting on undefined parent', t => {
  var spec = [
    '@defaults',
    [['a.b', 5]],
    ['@get', 'a.b']
  ];
  t.deepEqual(5, vcharts.transform(spec));

  t.end();
});

test('transform - @defaults - should not override options', t => {
  var spec = [
    '@defaults',
    [['a', 5]],
    ['@get', 'a']
  ];
  t.deepEqual(7, vcharts.transform(spec, {a: 7}));

  t.end();
});

test('transform - @defaults - should not override values from current scope', t => {
  var spec = [
    '@map',
    [1, 2, 3],
    'd',
    [
      '@defaults',
      [['d', 5]],
      ['@get', 'd']
    ]
  ];
  t.deepEqual([1, 2, 3], vcharts.transform(spec));

  t.end();
});

test('transform - @defaults - should only override undefined values', t => {
  var spec = ['@defaults', [['a', 5]], ['@get', 'a']];
  t.deepEqual(0, vcharts.transform(spec, {a: 0}));
  t.deepEqual(false, vcharts.transform(spec, {a: false}));
  t.deepEqual(5, vcharts.transform(spec, {a: undefined}));

  t.end();
});

test('transform - @let - should allow nested defaulting on defined parent', t => {
  var spec = [
    '@let',
    [['a', {}], ['a.b', 5]],
    [['@get', 'a.b'], ['@get', 'a.d']]
  ];
  t.deepEqual([5, 1], vcharts.transform(spec, {a: {d: 1}}));

  t.end();
});

test('transform - @let - should allow nested defaulting on undefined parent', t => {
  var spec = [
    '@let',
    [['a.b', 5]],
    ['@get', 'a.b']
  ];
  t.deepEqual(5, vcharts.transform(spec));

  t.end();
});

test('transform - @let - should override options', t => {
  var spec = [
    '@let',
    [['a', 5]],
    ['@get', 'a']
  ];
  t.deepEqual(5, vcharts.transform(spec, {a: 7}));

  t.end();
});

test('transform - @let - should override values from current scope', t => {
  var spec = [
    '@map',
    [1, 2, 3],
    'd',
    [
      '@let',
      [['d', 5]],
      ['@get', 'd']
    ]
  ];
  t.deepEqual([5, 5, 5], vcharts.transform(spec));

  t.end();
});

test('transform - @let - should only override undefined values', t => {
  var spec = ['@defaults', [['a', 5]], ['@get', 'a']];
  t.deepEqual(0, vcharts.transform(spec, {a: 0}));
  t.deepEqual(false, vcharts.transform(spec, {a: false}));
  t.deepEqual(5, vcharts.transform(spec, {a: undefined}));

  t.end();
});

test('transform - @map - should build an array', t => {
  var spec = ['@map', [1, 2, 3], 'd', ['@get', 'd']];
  t.deepEqual([1, 2, 3], vcharts.transform(spec));

  t.end();
});

test('transform - @map - should not add null array items', t => {
  var spec = ['@map', [1, null, 3], 'd', ['@get', 'd']];
  t.deepEqual([1, 3], vcharts.transform(spec));

  t.end();
});

test('transform - @map - can contain complex objects', t => {
  var spec = ['@map', [1, 2, 3], 'd', {a: ['@get', 'd']}];
  t.deepEqual([{a: 1}, {a: 2}, {a: 3}], vcharts.transform(spec));

  t.end();
});

test('transform - @map - can nest', t => {
  var spec = [
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
  ], vcharts.transform(spec));

  t.end();
});

test('transform - @map - should not modify options', t => {
  var spec = ['@map', [1, 2, 3], 'd', ['@get', 'd']];
  var options = {b: 12};
  vcharts.transform(spec, options);
  t.deepEqual({b: 12}, options);

  t.end();
});

test('transform - @map - should override option with loop variable', t => {
  var spec = ['@map', [1, 2, 3], 'd', ['@get', 'd']];
  var options = {d: 12};
  t.deepEqual([1, 2, 3], vcharts.transform(spec, options));
  t.deepEqual({d: 12}, options);

  t.end();
});

test('transform - @if - should choose first option when true', t => {
  var spec = ['@if', true, 10, 20];
  t.deepEqual(10, vcharts.transform(spec));

  t.end();
});

test('transform - @if - should choose second option when false', t => {
  var spec = ['@if', false, 10, 20];
  t.deepEqual(20, vcharts.transform(spec));

  t.end();
});

test('transform - @if - should work with sub-expressions', t => {
  var spec = ['@if', ['@get', 'a'], ['@get', 'b'], 20];
  t.deepEqual(5, vcharts.transform(spec, {a: true, b: 5}));

  t.end();
});

test('transform - @if - should treat JavaScript falsy values as false', t => {
  var spec = [
    ['@if', null, 10, 20],
    ['@if', undefined, 10, 20],
    ['@if', 0, 10, 20],
    ['@if', NaN, 10, 20],
    ['@if', '', 10, 20]
  ]
  t.deepEqual(
    [20, 20, 20, 20, 20],
    vcharts.transform(spec)
  );

  t.end();
});

test('transform - @eq - should test for JavaScript === equality', t => {
  var spec = [
    ['@eq', {}, {}],
    ['@eq', 0, 0],
    ['@eq', 'abc', 'abc'],
    ['@eq', 1, '1'],
    ['@eq', null, null]
  ]
  t.deepEqual(
    [false, true, true, false, true],
    vcharts.transform(spec)
  );

  t.end();
});

test('transform - @eq - can work with sub-expressions', t => {
  var spec = [
    ['@eq', ['@get', 'a'], 10],
    ['@eq', ['@get', 'b'], ['@get', 'c']]
  ];
  t.deepEqual(
    [true, true],
    vcharts.transform(spec, {a: 10, b: 5, c: 5})
  );

  t.end();
});

test('transform - @join - should join strings', t => {
  var spec = [
    '@join', ',', ['a', 'b', 'c', 'd']
  ]
  t.equal('a,b,c,d', vcharts.transform(spec));

  t.end();
});

test('transform - @orient - should leave horizontal specs unchanged', t => {
  var spec = [
    '@orient',
    'horizontal',
    {x: 1, y: 2, yc: 3, width: 5}
  ];
  t.deepEqual({x: 1, y: 2, yc: 3, width: 5}, vcharts.transform(spec));

  t.end();
});

test('transform - @orient - should re-orient vertical specs and leave other props', t => {
  var spec = [
    '@orient',
    'vertical',
    {x: 1, y: 2, yc: 2, width: 5, hello: 10}
  ];
  t.deepEqual({y: 1, x: 2, xc: 2, height: 5, hello: 10}, vcharts.transform(spec));

  t.end();
});

test('transform - @merge - should merge objects', t => {
  var spec = [
    '@merge',
    {a: 1},
    {b: 2},
    {c: 3}
  ];
  t.deepEqual({a: 1, b: 2, c: 3}, vcharts.transform(spec));

  t.end();
});

test('transform - @merge - should merge arrays', t => {
  var spec = [
    '@merge',
    {a: [1]},
    {a: []},
    {a: [2, 3]}
  ];
  t.deepEqual({a: [1, 2, 3]}, vcharts.transform(spec));

  t.end();
});

test('transform - @merge - should give precedence to first data type if they dont match', t => {
  var spec = [
    '@merge',
    {a: [1]},
    {a: 'b'}
  ];
  t.deepEqual({a: [1]}, vcharts.transform(spec));
  spec = [
    '@merge',
    {a: 'b'},
    {a: [1]}
  ];
  t.deepEqual({a: 'b'}, vcharts.transform(spec));

  t.end();
});

test('transform - @merge - should use the other if one is null or undefined', t => {
  var spec = [
    '@merge',
    {
      a: null,
      b: undefined
    },
    {a: 'a', b: 'b'}
  ];
  t.deepEqual({a: 'a', b: 'b'}, vcharts.transform(spec));
  spec = [
    '@merge',
    {a: 'a', b: 'b'},
    {
      a: null,
      b: undefined
    }
  ];
  t.deepEqual({a: 'a', b: 'b'}, vcharts.transform(spec));

  t.end();
});

test('transform - @apply - should apply template', t => {
  var spec = [
    '@apply',
    'test',
    {a: 'world'}
  ];
  vcharts.templates.test = {hello: ['@get', 'a']};
  t.deepEqual({hello: 'world'}, vcharts.transform(spec));

  t.end();
});
