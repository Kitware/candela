"""Utilities for handling query language expressions on the serverside."""


_opfunc = {
    '<=': lambda x, y: x <= y,
    '<': lambda x, y: x < y,
    '>=': lambda x, y: x >= y,
    '>': lambda x, y: x > y,
    '=': lambda x, y: x == y,
    '!=': lambda x, y: x != y
}


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
        field = operands[0]
        candidates = operands[1]

        return lambda row: row[field] in candidates
    elif operator == 'not in':
        field = operands[0]
        candidates = operands[1]

        return lambda row: row[field] not in candidates
    elif operator in ['<=', '<', '>=', '>', '=', '!=']:
        field = operands[0]
        value = operands[1]

        return lambda row: _opfunc[operator](row[field], value)


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


def astToMongo(ast):
    """Convert a query language AST into an equivalent Mongo filter."""
    operator = ast['operator']
    operands = ast['operands']

    if operator in ['or', 'and']:
        left = astToMongo(operands[0])
        right = astToMongo(operands[1])

        return {_mongo_operators[operator]: [left, right]}
    elif operator == 'not':
        raise RuntimeError()
    elif operator in ['in', 'not in', '<=', '<', '>=', '>', '=', '!=']:
        field = operands[0]
        value = operands[1]

        return {field: {_mongo_operators[operator]: value}}
