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


class TestQueryLanguage(unittest.TestCase):
    """Test suite."""
    def run_expressions(self, ast_file, data, baseline):
        """Test several ASTs on a sequence of data against a set of baselines."""
        asts = None
        with open(ast_file) as f:
            asts = json.load(f)

        funcs = map(ql.astToFunction, asts)

        for ((f, a), d), b in zip(itertools.product(zip(funcs, asts), data), baseline):
            self.assertEqual(f(d), b, '%s on %s should be %s' % (a, d, not b))

    def test_operator_expressions(self):
        """Test operator expressions."""
        self.run_expressions('test/operator-ast-baselines.json', data, [
            True, False, False,
            True, True, False,
            False, False, True,
            False, True, True,
            False, True, False,
            True, False, True
        ])

    def test_conjunction_expressions(self):
        """Test conjunction expressions."""
        self.run_expressions('test/conjunction-ast-baselines.json', data, [False, True, False])


if __name__ == '__main__':
    unittest.main()
