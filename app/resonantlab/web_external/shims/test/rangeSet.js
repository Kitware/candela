import test from 'node/tape';
import RangeSet from '../rangeSet.js';

function stringComparator (a, b) {
  return a.localeCompare(b);
}

let regularRange = {
  lowBound: 4,
  highBound: 8
};
let unboundedRange = {};
let invalidRange = {
  lowBound: 10,
  highBound: 0
};
let littleRange = {
  lowBound: 5.5,
  highBound: 6
};
let lowDisjoinRange = {
  lowBound: 2,
  highBound: 3
};
let highDisjointRange = {
  lowBound: 9,
  highBound: 10
};
let highBoundedRange = {
  highBound: 7
};
let lowBoundedRange = {
  lowBound: 5
};

let testRanges = [
  [unboundedRange, regularRange],
  [lowBoundedRange, highBoundedRange],
  [invalidRange],
  [highBoundedRange, regularRange],
  [lowBoundedRange, regularRange],
  [regularRange],
  [],
  [regularRange],
  [lowDisjoinRange, regularRange],
  [regularRange, highDisjointRange, lowDisjoinRange]
];
let testRanges2 = [
  [invalidRange],
  [highBoundedRange],
  [lowBoundedRange],
  [regularRange],
  [regularRange],
  [littleRange],
  [regularRange],
  [lowDisjoinRange],
  [highDisjointRange],
  []
];

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

test('RangeSet: Sorting ranges', t => {
  let sortingSolutions = [
    [unboundedRange, regularRange],
    [highBoundedRange, lowBoundedRange],
    [invalidRange],
    [highBoundedRange, regularRange],
    [regularRange, lowBoundedRange],
    [regularRange],
    [],
    [regularRange],
    [lowDisjoinRange, regularRange],
    [lowDisjoinRange, regularRange, highDisjointRange]
  ];
  for (let i = 0; i < testRanges.length; i += 1) {
    let outputRange = JSON.stringify(testRanges[i]);
    let outputSolution = JSON.stringify(sortingSolutions[i]);
    t.deepEqual(testRanges[i].concat().sort(RangeSet.compareRanges), sortingSolutions[i],
      `${outputRange} sorts as ${outputSolution}`);
  }
  t.end();
});

test('RangeSet: Cleaning range lists', t => {
  let cleaningSolutions = [
    [unboundedRange],
    [unboundedRange],
    [],
    [{ highBound: 8 }],
    [{ lowBound: 4 }],
    [regularRange],
    [],
    [regularRange],
    [lowDisjoinRange, regularRange],
    [lowDisjoinRange, regularRange, highDisjointRange]
  ];
  for (let i = 0; i < testRanges.length; i += 1) {
    let outputRange = JSON.stringify(testRanges[i]);
    let outputSolution = JSON.stringify(cleaningSolutions[i]);
    t.deepEqual(RangeSet.cleanRangeList(testRanges[i]), cleaningSolutions[i],
      `${outputRange} simplifies to ${outputSolution}`);
  }
  t.end();
});

test('RangeSet: Union', t => {
  let unionSolutions = [
    [unboundedRange],
    [unboundedRange],
    [lowBoundedRange],
    [{ highBound: 8 }],
    [{ lowBound: 4 }],
    [regularRange],
    [regularRange],
    [lowDisjoinRange, regularRange],
    [lowDisjoinRange, regularRange, highDisjointRange],
    [lowDisjoinRange, regularRange, highDisjointRange]
  ];
  for (let i = 0; i < testRanges.length; i += 1) {
    let outputRange = JSON.stringify(testRanges[i]);
    let outputRange2 = JSON.stringify(testRanges2[i]);
    let outputSolution = JSON.stringify(unionSolutions[i]);
    t.deepEqual(RangeSet.rangeUnion(testRanges[i], testRanges2[i]), unionSolutions[i],
      `${outputRange} union ${outputRange2} = ${outputSolution}`);
  }
  t.end();
});

test('RangeSet: Intersection', t => {
  let intersectionSolutions = [
    [],
    [{ highBound: 7 }],
    [],
    [regularRange],
    [regularRange],
    [littleRange],
    [],
    [],
    [],
    []
  ];
  for (let i = 0; i < testRanges.length; i += 1) {
    let outputRange = JSON.stringify(testRanges[i]);
    let outputRange2 = JSON.stringify(testRanges2[i]);
    let outputSolution = JSON.stringify(intersectionSolutions[i]);
    t.deepEqual(RangeSet.rangeIntersection(testRanges[i], testRanges2[i]), intersectionSolutions[i],
      `${outputRange} intersect ${outputRange2} = ${outputSolution}`);
  }
  t.end();
});

test('RangeSet: Subtraction', t => {
  let subtractionSolutions = [
    [unboundedRange],
    [{ lowBound: 7 }],
    [],
    [{ highBound: 4 }],
    [{ lowBound: 8 }],
    [{ lowBound: 4, highBound: 5.5 }, { lowBound: 6, highBound: 8 }],
    [],
    [regularRange],
    [lowDisjoinRange, regularRange],
    [lowDisjoinRange, regularRange, highDisjointRange]
  ];
  for (let i = 0; i < testRanges.length; i += 1) {
    let outputRange = JSON.stringify(testRanges[i]);
    let outputRange2 = JSON.stringify(testRanges2[i]);
    let outputSolution = JSON.stringify(subtractionSolutions[i]);
    t.deepEqual(RangeSet.rangeSubtract(testRanges[i], testRanges2[i]), subtractionSolutions[i],
      `${outputRange} - ${outputRange2} = ${outputSolution}`);
  }
  t.end();
});
