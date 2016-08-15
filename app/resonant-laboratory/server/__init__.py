import os
from girder.api.rest import Resource
from girder.constants import AssetstoreType
from girder.utility.assetstore_utilities import setAssetstoreAdapter
from girder.utility.filesystem_assetstore_adapter import FilesystemAssetstoreAdapter
from girder.utility.gridfs_assetstore_adapter import GridFsAssetstoreAdapter
from girder.plugins.database_assetstore.assetstore import DatabaseAssetstoreAdapter
from girder.utility.plugin_utilities import registerPluginWebroot
from semantic_assetstore_adapter import semantic_access
from anonymousAccess import AnonymousAccess
from versioning import Versioning
from datasetItem import DatasetItem
from projectItem import ProjectItem


class ResonantLaboratory(Resource):
    _cp_config = {'tools.staticdir.on': True,
                  'tools.staticdir.index': 'index.html'}

    def __init__(self, info):
        super(ResonantLaboratory, self).__init__()
        self.resourceName = 'resonantLaboratoryapp'

        self.info = info
        self.versioning = Versioning()
        self.anonymousAccess = AnonymousAccess(self)
        self.datasetItem = DatasetItem(self)
        self.projectItem = ProjectItem(self)


def load(info):
    ResonantLaboratory._cp_config['tools.staticdir.dir'] = os.path.join(
        os.path.relpath(info['pluginRootDir'],
                        info['config']['/']['tools.staticdir.root']),
        'web_client')

    # Move girder app to /girder, serve sumo app from /
    app = ResonantLaboratory(info)
    registerPluginWebroot(app, info)

    # Expose versioning endpoint
    info['apiRoot'].system.route('GET', ('resonantLaboratoryVersion', ),
                                 app.versioning.versionNumber)

    # Expose anonymous access endpoints
    info['apiRoot'].item.route('POST', ('anonymousAccess', 'privateItem'),
                               app.anonymousAccess.getOrMakePrivateItem)
    info['apiRoot'].item.route('POST', ('anonymousAccess', 'scratchItem'),
                               app.anonymousAccess.makeScratchItem)
    info['apiRoot'].folder.route('GET', ('anonymousAccess', 'privateFolder'),
                                 app.anonymousAccess.getOrMakePrivateFolder)
    info['apiRoot'].folder.route('GET', ('anonymousAccess', 'publicFolder'),
                                 app.anonymousAccess.getOrMakePublicFolder)
    info['apiRoot'].item.route('POST', (':id', 'anonymousAccess', 'togglePublic'),
                               app.anonymousAccess.togglePublic)
    info['apiRoot'].item.route('POST', (':id', 'anonymousAccess', 'updateScratch'),
                               app.anonymousAccess.updateScratchItem)
    info['apiRoot'].item.route('GET', (':id', 'anonymousAccess', 'info'),
                               app.anonymousAccess.itemInfo)
    info['apiRoot'].item.route('GET', ('anonymousAccess', 'validateScratchItems'),
                               app.anonymousAccess.validateScratchItems)
    info['apiRoot'].item.route('PUT', ('anonymousAccess', 'adoptScratchItems'),
                               app.anonymousAccess.adoptScratchItems)

    # Expose dataset endpoints
    info['apiRoot'].item.route('POST', (':id', 'dataset'),
                               app.datasetItem.setupDataset)
    info['apiRoot'].item.route('POST', (':id', 'dataset', 'inferSchema'),
                               app.datasetItem.inferSchema)
    info['apiRoot'].item.route('POST', (':id', 'dataset', 'getHistograms'),
                               app.datasetItem.getHistograms)

    # Expose project endpoint
    info['apiRoot'].item.route('POST', (':id', 'project'),
                               app.projectItem.setupProject)

    # Install "semantic" download adapters into Girder's table of adapters.
    setAssetstoreAdapter(AssetstoreType.FILESYSTEM, semantic_access(FilesystemAssetstoreAdapter))
    setAssetstoreAdapter(AssetstoreType.GRIDFS, semantic_access(GridFsAssetstoreAdapter))
    setAssetstoreAdapter(AssetstoreType.DATABASE, semantic_access(DatabaseAssetstoreAdapter))
