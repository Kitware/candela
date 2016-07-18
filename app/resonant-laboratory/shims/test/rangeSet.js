import test from 'tape';
import RangeSet from '../rangeSet.js';

function stringComparator (a, b) {
  return a.localeCompare(b);
}

test('RangeSet: Finding most extreme values', t => {
  let range = [1, 3, -5, 2];
  t.equal(RangeSet.mostExtremeValue(range, '>'), 3, `3 is the highest value in [${range}]`);
  t.equal(RangeSet.mostExtremeValue(range, '<'), -5, `minus 5 is the lowest value in [${range}]`);
  range = [undefined, 3, -5];
  t.equal(RangeSet.mostExtremeValue(range, '>'), undefined, `No high bound in [${range}]`);
  t.equal(RangeSet.mostExtremeValue(range, '<'), undefined, `No low bound in [${range}]`);
  range = ['B', 'a'];
  t.equal(RangeSet.mostExtremeValue(range, '>'), 'a', 'a > B ignoring locale');
  t.equal(RangeSet.mostExtremeValue(range, '>', stringComparator), 'B', 'B > a using locale');
  t.end();
});

test('RangeSet: Cleaning range lists', t => {
  let unboundedRange = {};
  let invalidRange = {
    lowBound: 10,
    highBound: 0
  };
  let regularRange = {
    lowBound: 4,
    highBound: 8
  };
  let highBoundedRange = {
    highBound: 7
  };
  let lowBoundedRange = {
    lowBound: 5
  };

  let testRanges = [
    [unboundedRange, regularRange],
    [highBoundedRange, lowBoundedRange],
    [invalidRange],
    [highBoundedRange, regularRange],
    [lowBoundedRange, regularRange]
  ];
  let testSolutions = [
    [unboundedRange],
    [unboundedRange],
    [],
    [{
      highBound: 7,
      lowBound: 4
    }],
    [{
      highBound: 8,
      lowBound: 5
    }]
  ];

  for (let i = 0; i < testRanges.length; i += 1) {
    let outputRange = JSON.stringify(testRanges[i]);
    let outputSolution = JSON.stringify(testSolutions[i]);
    t.deepEqual(RangeSet.cleanRangeList(testRanges[i]), testSolutions[i],
      `Clean ${outputRange} to become ${outputSolution}`);
  }
  t.end();
});
