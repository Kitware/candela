import test from 'tape-catch';

import VisComponent from '../VisComponent';

test('VisComponent class', t => {
  t.plan(5);

  t.throws(() => new VisComponent(), /"el" is a required argument$/, 'VisComponent should throw an error when called without an argument');

  const el = 'hello, world';
  let vis = new VisComponent(el);
  t.equal(vis.el, el, 'VisComponent should save the `el` passed in on its `el` property');

  t.throws(() => vis.render(), /render\(\) is pure abstract$/, 'VisComponent should throw an error when render() is called');

  const prom = vis.update();
  prom.then(result => t.equal(vis, result, 'VisComponent should return itself when update() is called'));

  t.deepEqual(vis.serializationFormats, [], 'VisComponent should have empty serializationFormats property');
});
