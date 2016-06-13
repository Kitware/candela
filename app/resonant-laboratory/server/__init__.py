import os
from girder.api.rest import Resource
from anonymousAccess import AnonymousAccess
from versioning import Versioning
from datasetItem import DatasetItem


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

    # Expose anonymous access endpoints
    anonymousAccess = AnonymousAccess()
    info['apiRoot'].item.route('POST', ('anonymousAccess', 'privateItem'),
                               anonymousAccess.getOrMakePrivateItem)
    info['apiRoot'].item.route('POST', ('anonymousAccess', 'scratchItem'),
                               anonymousAccess.makeScratchItem)
    info['apiRoot'].folder.route('GET', ('anonymousAccess', 'privateFolder'),
                                 anonymousAccess.getOrMakePrivateFolder)
    info['apiRoot'].folder.route('GET', ('anonymousAccess', 'publicFolder'),
                                 anonymousAccess.getOrMakePublicFolder)
    info['apiRoot'].item.route('POST', (':id', 'anonymousAccess', 'togglePublic'),
                               anonymousAccess.togglePublic)
    info['apiRoot'].item.route('POST', (':id', 'anonymousAccess', 'updateScratch'),
                               anonymousAccess.updateScratchItem)
    info['apiRoot'].item.route('GET', (':id', 'anonymousAccess', 'info'),
                               anonymousAccess.itemInfo)
    info['apiRoot'].item.route('GET', ('anonymousAccess', 'validateScratchItems'),
                               anonymousAccess.validateScratchItems)
    info['apiRoot'].item.route('PUT', ('anonymousAccess', 'adoptScratchItems'),
                               anonymousAccess.adoptScratchItems)

    # Expose summarization endpoints
    datasetItem = DatasetItem(info)
    info['apiRoot'].item.route('POST', (':id', 'dataset'),
                               datasetItem.setupDataset)
    info['apiRoot'].item.route('GET', (':id', 'dataset', 'inferSchema'),
                               datasetItem.inferSchema)
    info['apiRoot'].item.route('GET', (':id', 'dataset', 'getHistograms'),
                               datasetItem.getHistograms)
    info['apiRoot'].item.route('GET', (':id', 'dataset', 'getData'),
                               datasetItem.getData)

    # Expose versioning endpoint
    versioning = Versioning()
    info['apiRoot'].system.route('GET', ('resonantLaboratoryVersion', ),
                                 versioning.versionNumber)
