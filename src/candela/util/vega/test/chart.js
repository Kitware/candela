import test from 'tape';
import vcharts from '..';

test.skip('chart width and height should be based on el properties', t => {
  const padding = {
    top: 10,
    left: 20,
    bottom: 30,
    right: 40
  };

  let testSpec = {
    width: ['@get', 'width', 100],
    height: ['@get', 'height', 200],
    padding: padding
  };

  let c = vcharts.chart(testSpec, {offsetWidth: 0, offsetHeight: 0});

  t.deepEqual(c.spec, {
    width: 100,
    height: 200,
    padding: padding
  });

  c = vcharts.chart(testSpec, {offsetWidth: 300, offsetHeight: 400});

  t.deepEqual(c.spec, {
    width: (300 - 20 - 40),
    height: (400 - 10 - 30),
    padding: padding
  });

  t.end();
});

test('vcharts.chart()', t => {
  let c = vcharts.chart({marks: []}, document.createElement('div'));

  t.deepEqual(c.spec, {marks: []}, 'spec used should match the one specified');

  t.end();
});

test('vcharts.update()', t => {
  let template = {
    marks: [1]
  };
  let c = vcharts.chart(template, document.createElement('div'));

  t.deepEqual(c.template, template, 'template used should be the one requested (precondition)');
  t.deepEqual(c.spec, template, 'spec used should match the one specified (precondition)');

  let template2 = {
    marks: [1, 2, 3]
  };
  c.template = template2;
  c.update();

  t.deepEqual(c.spec, template2, 'update call should change the spec used to the one specified');

  t.end();
});
