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
        f = astToFunction(operands[0])
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
