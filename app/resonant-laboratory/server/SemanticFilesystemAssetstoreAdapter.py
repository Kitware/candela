from girder.utility.filesystem_assetstore_adapter import FilesystemAssetstoreAdapter


class SemanticFilesystemAssetstoreAdapter(FilesystemAssetstoreAdapter):
    def __init__(self, *args, **kwargs):
        super(SemanticFilesystemAssetstoreAdapter, self).__init__(*args, **kwargs)

    def downloadFile(self, *args, **kwargs):
        print 'SemanticFSAA.downloadFile()'
        return super(SemanticFilesystemAssetstoreAdapter, self).downloadFile(*args, **kwargs)
