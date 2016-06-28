import unittest
from SemanticFilesystemAssetstoreAdapter import StreamFile


def stream():
    yield 'hello '
    yield 'goodbye '
    yield 'adios\n'
    yield 'buenos dias'
    yield ' what\'s up?\n'
    yield 'yay!!!'


class TestStreamFile(unittest.TestCase):
    def test_read(self):
        sf = StreamFile(stream())

        word = sf.read(5)
        self.assertEqual(word, 'hello')

        self.assertFalse(sf.eof)

        rest = sf.read()
        self.assertEqual(rest, ' goodbye adios\nbuenos dias what\'s up?\nyay!!!')

        self.assertTrue(sf.eof)

        after = sf.read()
        self.assertEqual(after, '')

    def test_readline(self):
        sf = StreamFile(stream())

        line = sf.readline()
        self.assertEqual(line, 'hello goodbye adios\n')

    def test_readlines(self):
        sf = StreamFile(stream())

        lines = sf.readlines()
        self.assertEqual(lines, [
            'hello goodbye adios\n',
            'buenos dias what\'s up?\n',
            'yay!!!'
        ])

    def test_overread(self):
        sf = StreamFile(stream())

        target = stream()
        target = ''.join(list(target))

        text = sf.read(len(target) + 10)

        self.assertEqual(text, target)

if __name__ == '__main__':
    unittest.main()
