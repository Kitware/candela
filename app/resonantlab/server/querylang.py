"""Utilities for handling query language expressions on the serverside."""

import datetime
import dateutil.parser

_opfunc = {
    '<=': lambda x, y: x <= y,
    '<': lambda x, y: x < y,
    '>=': lambda x, y: x >= y,
    '>': lambda x, y: x > y,
    '=': lambda x, y: x == y,
    '!=': lambda x, y: x != y
}


def cast(value, typename):
    """Cast a value to a type, including special-purpose semantic processing for some values."""
    if typename is None:
        return value
    elif typename == 'integer':
        try:
            return int(value)
        except ValueError:
            return float('NaN')
    elif typename == 'number':
        try:
            return float(value)
        except ValueError:
            return float('NaN')
    elif typename == 'boolean':
        return bool(value) and value not in ['false', '0', 0, 'n']
    elif typename == 'string':
        return str(value)
    elif typename == 'date':
        if type(value) == int:
            return datetime.datetime.fromtimestamp(float(value) / 1000)
        else:
            return dateutil.parser.parse(value, default=datetime.datetime.fromtimestamp(0))
    else:
        raise ValueError('Illegal value for argument "typename": %s' % (typename))


def astToFunction(ast):
    """Convert a query language AST to a Python function that implements it."""
    operator = ast['operator']
    operands = ast['operands']

    if operator == 'or':
        f0 = astToFunction(operands[0])
        f1 = astToFunction(operands[1])

        return lambda row: f0(row) or f1(row)
    elif operator == 'and':
        f0 = astToFunction(operands[0])
        f1 = astToFunction(operands[1])

        return lambda row: f0(row) and f1(row)
    elif operator == 'not':
        f = astToFunction(operands)
        return lambda row: not f(row)
    elif operator == 'in':
        field = operands[0]['identifier']

        def coerce(x):
            return cast(x, operands[0]['type'])

        candidates = map(coerce, operands[1])

        return lambda row: field in row and coerce(row[field]) in candidates
    elif operator == 'not in':
        field = operands[0]['identifier']

        def coerce(x):
            return cast(x, operands[0]['type'])

        candidates = map(coerce, operands[1])

        return lambda row: field in row and coerce(row[field]) not in candidates
    elif operator in ['<=', '<', '>=', '>', '=', '!=']:
        field = operands[0]['identifier']

        def coerce(x):
            return cast(x, operands[0]['type'])

        value = coerce(operands[1])

        return lambda row: _opfunc[operator](coerce(row[field]), value)


_mongo_operators = {
    'or': '$or',
    'and': '$and',
    'in': '$in',
    'not in': '$nin',
    '<=': '$lte',
    '<': '$lt',
    '>=': '$gte',
    '>': '$gt',
    '=': '$eq',
    '!=': '$ne'
}


def _astToMongo_helper(ast):
    """Convert a query language AST into an equivalent Mongo filter."""
    operator = ast['operator']
    operands = ast['operands']

    if operator in ['or', 'and']:
        left = _astToMongo_helper(operands[0])
        right = _astToMongo_helper(operands[1])

        return {_mongo_operators[operator]: [left, right]}
    elif operator == 'not':
        raise TypeError('_astToMongo_helper() cannot operate on an AST with not-nodes.')
    elif operator in ['in', 'not in', '<=', '<', '>=', '>', '=', '!=']:
        field = operands[0]['identifier']
        value = operands[1]

        return {field: {_mongo_operators[operator]: value}}


def _invert(ast):
    """Invert the polarity of a boolean expression."""
    operator = ast['operator']
    operands = ast['operands']

    if operator == 'not':
        # To invert a not expression, just remove the not.
        return _eliminate_not(operands)
    elif operator in ['and', 'or']:
        # For and/or expressions, apply DeMorgan's laws.
        new_operator = 'and' if operator == 'or' else 'or'
        new_operands = map(lambda x: {'operator': 'not', 'operands': x}, operands)

        return {'operator': new_operator,
                'operands': map(_eliminate_not, new_operands)}
    elif operator in ['in', 'not in']:
        # For inclusion operators, just switch the one that was being used.
        return {'operator': 'in' if operator == 'not in' else 'not in',
                'operands': operands}
    elif operator[0] in ['<', '>']:
        # For comparison operators, flip the operator around.
        new_operator = '<' if operator[0] == '>' else '>'
        if len(operator) == 1:
            new_operator += '='

        return {'operator': new_operator,
                'operands': operands}
    else:
        # For equality operators, just switch the operator
        return {'operator': '=' if operator == '!=' else '!=',
                'operands': operands}


def _eliminate_not(ast):
    """Eliminate all not-nodes in the AST by transforming their contents."""
    operator = ast['operator']
    operands = ast['operands']

    if operator in ['and', 'or']:
        # And/or expressions have two boolean operands that must be processed
        # recursively.
        return {'operator': operator,
                'operands': map(_eliminate_not, operands)}
    elif operator in ['in', 'not in', '<=', '<', '>=', '>', '=', '!=']:
        # Operator expressions that work on constant values stay unchanged.
        return ast
    else:
        # Not expressions lose the not itself and invert the operand.
        return _eliminate_not(_invert(operands))


def astToMongo(ast):
    """Run the AST-to-mongo helper function above after converting it to a not-free equivalent AST."""
    return _astToMongo_helper(_eliminate_not(ast))
