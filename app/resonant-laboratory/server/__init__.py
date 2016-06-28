import os
from girder.api.rest import Resource
from girder.constants import AssetstoreType
from girder.utility.assetstore_utilities import setAssetstoreAdapter
from SemanticFilesystemAssetstoreAdapter import SemanticFilesystemAssetstoreAdapter, SemanticGridFsAssetstoreAdapter
from anonymousAccess import AnonymousAccess
from versioning import Versioning


class ResonantLaboratory(Resource):
    _cp_config = {'tools.staticdir.on': True,
                  'tools.staticdir.index': 'index.html'}

    def __init__(self):
        super(ResonantLaboratory, self).__init__()
        self.resourceName = 'resonantLaboratoryapp'


def load(info):
    ResonantLaboratory._cp_config['tools.staticdir.dir'] = os.path.join(
        os.path.relpath(info['pluginRootDir'],
                        info['config']['/']['tools.staticdir.root']),
        'web_client')

    # Move girder app to /girder, serve sumo app from /
    info['apiRoot'].resonantLaboratoryapp = ResonantLaboratory()

    (
        info['serverRoot'],
        info['serverRoot'].girder
    ) = (
        info['apiRoot'].resonantLaboratoryapp,
        info['serverRoot']
    )

    info['serverRoot'].api = info['serverRoot'].girder.api
    anonymousAccess = AnonymousAccess()
    info['apiRoot'].item.route('GET', ('privateItem', ),
                               anonymousAccess.getOrMakePrivateItem)
    info['apiRoot'].item.route('GET', ('scratchItem', ),
                               anonymousAccess.makeScratchItem)
    info['apiRoot'].folder.route('GET', ('privateFolder', ),
                                 anonymousAccess.getOrMakePrivateFolder)
    info['apiRoot'].folder.route('GET', ('publicFolder', ),
                                 anonymousAccess.getOrMakePublicFolder)
    info['apiRoot'].item.route('POST', (':id', 'togglePublic'),
                               anonymousAccess.togglePublic)
    info['apiRoot'].item.route('POST', (':id', 'updateScratch'),
                               anonymousAccess.updateScratchItem)
    info['apiRoot'].item.route('GET', (':id', 'info'),
                               anonymousAccess.itemInfo)
    info['apiRoot'].item.route('GET', ('validateScratchItems', ),
                               anonymousAccess.validateScratchItems)
    info['apiRoot'].item.route('PUT', ('adoptScratchItems', ),
                               anonymousAccess.adoptScratchItems)

    versioning = Versioning()
    info['apiRoot'].system.route('GET', ('resonantLaboratoryVersion', ),
                                 versioning.versionNumber)

    # Install "semantic" download adapters into Girder's table of adapters.
    setAssetstoreAdapter(AssetstoreType.FILESYSTEM, SemanticFilesystemAssetstoreAdapter)
    setAssetstoreAdapter(AssetstoreType.GRIDFS, SemanticGridFsAssetstoreAdapter)
