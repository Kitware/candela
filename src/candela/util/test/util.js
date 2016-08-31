import test from 'tape-catch';
import { inferAll } from '..';

test('inferAll()', t => {
  t.deepEqual(inferAll([{'a.b': 1}]), {'a.b': 'integer'}, 'should work on fields with nested dots');
  t.deepEqual(inferAll([{'a': {'b': 1}}]), {'a': 'string'}, 'should only accept top-level fields');

  t.end();
});
