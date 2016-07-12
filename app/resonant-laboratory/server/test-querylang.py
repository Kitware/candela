"""Test Python utilities related to query language processing."""

import itertools
import json
import unittest
import querylang as ql


data = [
    {'age': 19},
    {'age': 21},
    {'age': 23}
]


asts = None
with open('test/ast-baselines.json') as f:
    asts = json.load(f)


class TestQueryLanguage(unittest.TestCase):
    """Test suite."""

    def test_operator_expressions(self):
        """Test operator expressions."""
        baseline = [
            True, False, False,
            True, True, False,
            False, False, True,
            False, True, True,
            False, True, False,
            True, False, True
        ]

        funcs = map(ql.astToFunction, asts)

        for ((f, a), d), b in zip(itertools.product(zip(funcs, asts), data), baseline):
            self.assertEqual(f(d), b, '%s on %s should be %s' % (a, d, not b))


if __name__ == '__main__':
    unittest.main()
