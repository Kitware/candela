import csv
import json
import os
import sys
from girder.models.model_base import GirderException
from girder.utility.filesystem_assetstore_adapter import FilesystemAssetstoreAdapter


class StreamFile(object):
    def __init__(self, stream):
        self.stream = stream
        self.buf = ''
        self.closed = False
        self.eof = False

    def close(self):
        self.closed = True

    def flush(self):
        pass

    def __iter__(self):
        return self

    def next(self):
        if self.eof:
            raise StopIteration
        return self.readline()

    def read(self, n=None):
        if self.closed:
            raise ValueError('I/O operation on closed file')

        if self.eof:
            return ''

        if n is None:
            n = sys.maxsize

        try:
            while len(self.buf) < n:
                self.buf += self.stream.next()
        except StopIteration:
            self.eof = True

        chunk, self.buf = self.buf[:n], self.buf[n:]
        return chunk

    def readline(self, n=None):
        if self.closed:
            raise ValueError('I/O operation on closed file')

        if self.eof:
            return ''

        if n is None:
            n = sys.maxsize

        try:
            index = self.buf.index('\n')
        except ValueError:
            index = -1

        try:
            while index == -1:
                chunk = self.stream.next()

                try:
                    index = chunk.index('\n')
                except ValueError:
                    index = -1

                if index != -1:
                    index += len(self.buf)

                self.buf += chunk
        except StopIteration:
            self.eof = True
            return self.buf

        cut = min(index, n)
        chunk, self.buf = self.buf[:cut + 1], self.buf[cut + 1:]

        return chunk

    def readlines(self, sizehint=None):
        lines = []
        while not self.eof:
            lines.append(self.readline())

        return lines

    def seek(offset, whence):
        pass

    def tell():
        return 0

    def truncate(size):
        pass

    def write(str):
        pass

    def writelines(seq):
        pass


class SemanticFilesystemAssetstoreAdapter(FilesystemAssetstoreAdapter):
    def __init__(self, *args, **kwargs):
        super(SemanticFilesystemAssetstoreAdapter, self).__init__(*args, **kwargs)

    def downloadFile(self, file, offset=0, headers=True, endByte=None,
                     contentDisposition=None, extraParameters=None, **kwargs):
        print 'extraParameters: %s' % (extraParameters)
        if extraParameters is None:
            return super(SemanticFilesystemAssetstoreAdapter, self).downloadFile(file, offset, headers, endByte, contentDisposition, extraParameters, **kwargs)

        # TODO: for now, treat all special requests as being for a CSV file.
        path = self.fullPath(file)

        if not os.path.isfile(path):
            raise GirderException(
                'File %s does not exist.' % path,
                'girder.utility.filesystem_assetstore_adapter.'
                'file-does-not-exist')

        extraParameters = json.loads(extraParameters)
        offset = extraParameters.get('offset', 0)
        limit = extraParameters.get('limit', 0)

        def stream():
            with open(path) as csvfile:
                data = csv.reader(csvfile)

                # Read and return the header line.
                header_line = data.next()
                yield ','.join(header_line) + '\n'

                # Skip a number of lines equal to the offset parameter.
                for i in range(offset):
                    data.next()

                count = 0
                try:
                    while limit == 0 or count < limit:
                        line = data.next()
                        count += 1
                        yield ','.join(line) + '\n'
                except StopIteration:
                    pass

        return stream
