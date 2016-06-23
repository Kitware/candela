import csv
import json
import os
from girder.models.model_base import GirderException
from girder.utility.filesystem_assetstore_adapter import FilesystemAssetstoreAdapter


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
