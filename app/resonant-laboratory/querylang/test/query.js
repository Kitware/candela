import test from 'tape';
import { parseToFunction } from '..';

const operator_expression = [
  'age < 21',
  'age <= 21',
  'age > 21',
  'age >= 21',
  'age = 21',
  'age != 21'
];

const data = [
  {
    age: 19
  },

  {
    age: 21
  },

  {
    age: 23
  }
];

function testFunc (t, string, testData, baselines) {
  const func = parseToFunction(string);

  for (let i = 0; i < testData.length; i++) {
    const data = testData[i];
    const baseline = baselines[i];

    t.equal(func(data), baseline, `Expression '${string}', data '${JSON.stringify(testData[i])}'`);
  }
}

test('Operator expressions', t => {
  const baseline = [
    [true, false, false],
    [true, true, false],
    [false, false, true],
    [false, true, true],
    [false, true, false],
    [true, false, true]
  ];

  for (let i = 0; i < operator_expression.length; i++) {
    const expr = operator_expression[i];
    const baselines = baseline[i];

    testFunc(t, expr, data, baselines);
  }

  t.end();
});

test('Conjunction expressions', t => {
  const between_expression = 'age < 22 and age > 20';
  const baseline = [false, true, false];

  testFunc(t, between_expression, data, baseline);
  t.end();
});

test('Disjunction expressions', t => {
  const outside_expression = 'age > 22 or age < 20';
  const baseline = [true, false, true];

  testFunc(t, outside_expression, data, baseline);
  t.end();
});
