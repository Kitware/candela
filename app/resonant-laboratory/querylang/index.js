import query from './query.pegjs';

export function parseToAst (string) {
  return query.parse(string);
}

const opfunc = {
  '<=': function (x, y) {
    return x <= y;
  },

  '<': function (x, y) {
    return x < y;
  },

  '>=': function (x, y) {
    return x >= y;
  },

  '>': function (x, y) {
    return x > y;
  },

  '=': function (x, y) {
    return x === y;
  },

  '!=': function (x, y) {
    return x !== y;
  }
};

function checker (ast, include) {
  return function (row) {
    const data = row[ast.operands[0]];
    for (let i = 0; i < ast.operands[1].length; i++) {
      if (data === ast.operands[1][i]) {
        return include;
      }
    }

    return !include;
  };
}

export function astToFunction (ast) {
  switch (ast.operator) {
    case 'or':
      return function (row) {
        const f1 = parseToFunction(ast.operands[0]);
        const f2 = parseToFunction(ast.operands[1]);

        return f1(row) || f2(row);
      };

    case 'and':
      return function (row) {
        const f1 = parseToFunction(ast.operands[0]);
        const f2 = parseToFunction(ast.operands[1]);

        return f1(row) && f2(row);
      };

    case 'not':
      return function (row) {
        const f = astToFunction(ast.operands);
        return !f(row);
      };

    case 'in':
      return checker(ast, true);

    case 'not in':
      return checker(ast, false);

    case '<=':
    case '<':
    case '>=':
    case '>':
    case '=':
    case '!=':
      return function (row) {
        const data = row[ast.operands[0]];
        return opfunc[ast.operator](data, ast.operands[1]);
      };
  }
}

export function parseToFunction (string) {
  return astToFunction(parseToAst(string));
}
