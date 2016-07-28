import cherrypy
import csv
import json
import sys
from querylang import astToFunction
from girder.models.model_base import GirderException


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


def semantic_access(Cls, offset_limit=True):
    allowed_outputtypes = ['csv', 'json', 'jsonArray']

    module = 'resonant-laboratory.semantic-filesystem-assetstore-adapter'

    class NewCls(Cls):
        def __init__(self, *args, **kwargs):
            self.offset_limit = offset_limit
            super(NewCls, self).__init__(*args, **kwargs)

        def downloadFile(self, file, offset=0, headers=True, endByte=None,
                         contentDisposition=None, extraParameters=None, **kwargs):
            dataOffset = limit = 0

            if extraParameters is not None:
                extraParameters = json.loads(extraParameters)
                extraParameters['format'] = 'csv'
                dataOffset = extraParameters.get('offset', 0)
                limit = extraParameters.get('limit', 0)
                extraParameters['offset'] = 0
                extraParameters['limit'] = 0

            # Get the parent class's stream.
            base_stream = super(NewCls, self).downloadFile(file, offset, headers, endByte, contentDisposition, json.dumps(extraParameters), **kwargs)

            # Fall back to base class when no special parameters are specified.
            if extraParameters is None:
                return base_stream

            # Construct and return our own stream that implements the special
            # behaviors requested in extraParameters on top of the base class's
            # stream.

            outputType = extraParameters.get('outputType')
            if outputType is None:
                outputType = 'json'

            if outputType not in allowed_outputtypes:
                print 'outputType = %s is not allowed' % (outputType)
                raise GirderException('"outputType" must be one of: %s' % (', '.join(allowed_outputtypes)), '%s.illegal-argument' % (module))

            filterFunc = extraParameters.get('filter')
            if filterFunc is None:
                def filterFunc(x): return True
            else:
                filterFunc = astToFunction(filterFunc)

            # Set content-length header to zero and clear content-range.
            if 'Content-Length' in cherrypy.response.headers:
                del cherrypy.response.headers['Content-Length']
            if 'Content-Range' in cherrypy.response.headers:
                del cherrypy.response.headers['Content-Range']

            fileType = extraParameters.get('fileType')
            if fileType == 'csv':
                def stream():
                    temp = base_stream()
                    csvfile = StreamFile(temp)
                    data = csv.reader(csvfile)

                    header_line = data.next()
                    if outputType == 'csv':
                        yield ','.join(header_line) + '\n'
                    elif outputType == 'json':
                        yield '['

                    skipCount = 0
                    emitCount = 0
                    try:
                        while limit == 0 or emitCount < limit:
                            line = data.next()
                            dictLine = dict(zip(header_line, line))

                            # print filterFunc(dictLine), dictLine
                            if not filterFunc(dictLine):
                                continue

                            if skipCount < dataOffset:
                                skipCount += 1
                                continue

                            if outputType == 'csv':
                                yield ','.join(line) + '\n'
                            elif outputType == 'jsonArray':
                                yield json.dumps(dict(zip(header_line, line)))
                            elif outputType == 'json':
                                resultLine = json.dumps(dict(zip(header_line, line)))
                                if emitCount > 0:
                                    resultLine = ',' + resultLine
                                yield resultLine
                            emitCount += 1
                    except StopIteration:
                        pass
                    if outputType == 'json':
                        yield ']'

                return stream

    return NewCls
