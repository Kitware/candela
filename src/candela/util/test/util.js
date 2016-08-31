import test from 'tape-catch';
import { inferAll } from '..';
import { read } from 'datalib';

test('inferAll()', t => {
  t.deepEqual(inferAll([{'a.b': 1}]), {'a.b': 'integer'}, 'should work on fields with nested dots');
  t.deepEqual(inferAll([{'a': {'b': 1}}]), {'a': 'string'}, 'should only accept top-level fields');

  let testData = [{a: 1, b: 'foo', c: 1.5}];
  read(testData, {parse: 'auto'});
  t.deepEqual(testData.__types__, inferAll(testData), 'should work identically to datalib read() when no nested dots');

  t.end();
});
