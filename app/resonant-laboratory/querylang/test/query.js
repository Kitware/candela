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

const conjunction_expression = [
  'age < 22 and age > 20'  
];

const disjunction_expression = [
  'age > 22 or age < 20'
];

function test_expressions (t, exprs, baseline_path) {
  const asts = exprs.map(parseToAst);

  if (process.env.RESLAB_DUMP_AST) {
    fs.writeFileSync(baseline_path, JSON.stringify(asts, null, 4), {encoding: 'utf8'});
  }

  const baselines = JSON.parse(fs.readFileSync(baseline_path, {encoding: 'utf8'}));

  for (let i = 0; i < exprs.length; i++) {
    t.deepEqual(asts[i], baselines[i], `Expression '${exprs[i]}' parses correctly`);
  }
}

test('Operator expression parsing', t => {
  test_expressions(t, operator_expression, './app/resonant-laboratory/server/test/operator-ast-baselines.json')
  t.end();
});

test('Conjunction expression parsing', t => {
  test_expressions(t, conjunction_expression, './app/resonant-laboratory/server/test/conjunction-ast-baselines.json')
  t.end();
});

test('Disjunction expression parsing', t => {
  test_expressions(t, disjunction_expression, './app/resonant-laboratory/server/test/disjunction-ast-baselines.json');
  t.end();
});

test('Associative expression parsing', t => {
  const expr = [
    'age > 47 and age < 50 or name = "Picard"',
    '(age > 47 and age < 50) or (name = "Picard")'
  ];

  const ast = expr.map(parseToAst);

  t.deepEqual(ast[0], ast[1], `'${expr[0]}' and '${expr[1]}' parse to same AST`);
  t.end();
});

test('Anti-associative expression parsing', t => {
  const expr = [
    'age < 47 or age > 50 and name = "Picard"',
    '(age < 47 or age > 50) and (name = "Picard")'
  ];

  const ast = expr.map(parseToAst);

  t.notDeepEqual(ast[0], ast[1], `'${expr[0]}' and '${expr[1]}' parse to different ASTs`);
  t.end();
});
