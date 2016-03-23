import test from 'tape';
import vcharts from '../src';

test('chart - basic - width and height should be based on el properties', t => {
  t.plan(2);

  const padding = {
    top: 10,
    left: 20,
    bottom: 30,
    right: 40
  };

  vcharts.templates.test = {
    width: ['@get', 'width', 100],
    height: ['@get', 'height', 200],
    padding: padding
  };

  let c = vcharts.chart('test', {
    el: {offsetWidth: 0, offsetHeight: 0}
  });

  t.deepEqual({
    width: 100,
    height: 200,
    padding: padding
  }, c.spec);

  c = vcharts.chart('test', {
    el: {offsetWidth: 300, offsetHeight: 400}
  });

  t.deepEqual({
    width: (300 - 20 - 40),
    height: (400 - 10 - 30),
    padding: padding
  }, c.spec);

  t.end();
});

test('vega - should produce vega spec', t => {
  let c = vcharts.chart('vega', {
    el: document.createElement('div'),
    spec: {marks: []}
  });

  t.deepEqual(vcharts.templates.vega, c.template);
  t.deepEqual({marks: []}, c.spec);

  t.end();
});

test('update - should update options', function () {
  var c = vcharts.chart('vega', {
    el: document.createElement('div')
    spec: {marks: [1]}
  });

  assert.deepEqual(vcharts.templates.vega, c.template);
  assert.deepEqual({el: {}, spec: {marks: [1]}}, c.options);

  c.update({spec: {marks: [1, 2, 3]}});

  assert.deepEqual({el: {}, spec: {marks: [1, 2, 3]}}, c.options);
});
