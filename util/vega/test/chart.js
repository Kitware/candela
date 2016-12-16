import test from 'tape-catch';
import vega from '..';

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

  let c = vega.chart(testSpec, {offsetWidth: 0, offsetHeight: 0});

  t.deepEqual(c.spec, {
    width: 100,
    height: 200,
    padding: padding
  });

  c = vega.chart(testSpec, {offsetWidth: 300, offsetHeight: 400});

  t.deepEqual(c.spec, {
    width: (300 - 20 - 40),
    height: (400 - 10 - 30),
    padding: padding
  });

  t.end();
});
