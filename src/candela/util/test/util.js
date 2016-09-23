import test from 'tape-catch';
import { inferAll, read } from '..';
import dl from 'datalib';

test('inferAll()', t => {
  t.deepEqual(inferAll([{'a.b': 1}]), {'a.b': 'integer'}, 'should work on fields with nested dots');
  t.deepEqual(inferAll([{'a': {'b': 1}}]), {'a': 'string'}, 'should only accept top-level fields');

  let testData = [{a: 1, b: 'foo', c: 1.5}];
  t.deepEqual(dl.type.inferAll(testData), inferAll(testData), 'should work identically to datalib inferAll() when no nested dots');

  t.end();
});

test('read()', t => {
  let testData = [{'a.b': 1}];
  read(testData);
  t.deepEqual({'a.b': 'integer'}, testData.__types__, 'should work on fields with nested dots');

  let testData1 = [{a: 1, b: 'foo', c: 1.5}];
  let testData2 = [{a: 1, b: 'foo', c: 1.5}];
  dl.read(testData1, {parse: 'auto'});
  read(testData2);
  t.deepEqual(testData1.__types__, testData2.__types__, 'should work identically to datalib read() when no nested dots');

  t.end();
});
