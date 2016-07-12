import process from 'process';
import fs from 'fs';
import test from 'tape';
import { parseToAst } from '..';

const operator_expression = [
  'age < 21',
  'age <= 21',
  'age > 21',
  'age >= 21',
  'age = 21',
  'age != 21'
];

test('Query language parser', t => {
  const asts = operator_expression.map(parseToAst);

  const baseline_path = './app/resonant-laboratory/server/test/ast-baselines.json';
  if (process.env.RESLAB_DUMP_AST) {
    fs.writeFileSync(baseline_path, JSON.stringify(asts, null, 4), {encoding: 'utf8'});
  }

  const baselines = JSON.parse(fs.readFileSync(baseline_path, {encoding: 'utf8'}));

  for (let i = 0; i < operator_expression.length; i++) {
    t.deepEqual(asts[i], baselines[i], `Expression '${operator_expression[i]}' parses correctly`);
  }

  t.end();
});

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

test('Associativity', t => {
  const expr1 = 'age > 47 and age < 50 or name = "Picard"';
  const expr2 = '(age > 47 and age < 50) or (name = "Picard")';

  const ages = [46, 47, 48, 51];
  const names = ['Riker', 'Picard'];

  const func1 = parseToFunction(expr1);
  const func2 = parseToFunction(expr2);

  ages.forEach(age => {
    names.forEach(name => {
      const data = { age, name };
      const result = (age > 47 && age < 50) || (name === 'Picard');

      t.equal(func1(data), func2(data), 'Expression is associative');
    });
  });

  t.end();
});

test('Anti-associativity', t => {
  const expr1 = 'age < 47 or age > 50 and name = "Picard"';
  const expr2 = '(age < 47 or age > 50) and (name = "Picard")';

  const func1 = parseToFunction(expr1);
  const func2 = parseToFunction(expr2);

  const data = {
    age: 46,
    name: 'Riker'
  };

  t.notEqual(func1(data), func2(data), 'Expression is not associative');

  t.end();
});
