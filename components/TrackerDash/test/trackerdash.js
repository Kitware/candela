import test from 'tape-catch';
import TrackerDash from '..';
import appSettings from '../../../app/examples/trackerdash';

test('TrackerDash component', t => {
  let el = document.createElement('div');
  let vis = new TrackerDash(el, appSettings);
  vis.render();
  t.equal(el.childNodes.length, 1, 'TrackerDash should have a single element under the top-level div');
  t.end();
});
