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

typed_data = [
    {'negative_pi': '-3.14159',
     'negative_pi_indiana': '-3',
     'age': '19',
     'name': '11001001',
     'flag': 'n',
     'start': '2016-07-27'},
    {'negative_pi': '3.14159',
     'negative_pi_indiana': '3',
     'age': '22',
     'name': '11001002',
     'flag': 'y',
     'start': '2016-07-21'}
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

    def test_disjunction_expressions(self):
        """Test disjunction expressions."""
        self.run_expressions('test/disjunction-ast-baselines.json', data, [True, False, True])

    def test_typed_expressions(self):
        """Test typed expressions."""
        self.run_expressions('test/typed-ast-baselines.json', typed_data, [
            True, False,
            True, False,
            True, False,
            True, False,
            True, False,
            True, False
        ])


class TestQueryLanguageMongo(unittest.TestCase):
    """Test functions for generating Mongo queries from query language expressions."""

    def test_conjunction_expressions(self):
        """Test conjunction expressions."""
        asts = None
        with open('test/conjunction-ast-baselines.json') as f:
            asts = json.load(f)

        baselines = [
            {'$and': [{'age': {'$lt': 22}},
                      {'age': {'$gt': 20}}]}
        ]

        for expr, baseline in zip(map(ql.astToMongo, asts), baselines):
            self.assertEqual(expr, baseline)

    def test_not_expressions(self):
        """Test not expressions."""
        asts = None
        with open('test/not-ast-baselines.json') as f:
            asts = json.load(f)

        baselines = [
            {'$or': [{'age': {'$gte': 22}},
                     {'age': {'$lte': 20}}]},
            {'$or': [{'age': {'$gt': 22}},
                     {'age': {'$lte': 20}}]},
            {'$or': [{'age': {'$lte': 22}},
                     {'age': {'$gte': 20}}]},
            {'$or': [{'age': {'$lt': 22}},
                     {'age': {'$gte': 20}}]},
            {'age': {'$ne': 10}},
            {'age': {'$eq': 10}},
            {'age': {'$nin': [1, 2, 3, 4, 5]}},
            {'age': {'$in': [1, 2, 3, 4, 5]}},
            {'age': {'$gt': 22}}
        ]

        for expr, baseline in zip(map(ql.astToMongo, asts), baselines):
            self.assertEqual(expr, baseline)

if __name__ == '__main__':
    unittest.main()
