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

function testFunc (t, batch, string, testData, baselines) {
  const func = parseToFunction(string);

  for (let i = 0; i < testData.length; i++) {
    const data = testData[i];
    const baseline = baselines[i];

    t.equal(func(data), baseline, `Batch ${batch}, case ${i}`);
  }
}

test('Operator expressions', t => {
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

    testFunc(t, expr, expr, data, baselines);
  }

  t.end();
});
