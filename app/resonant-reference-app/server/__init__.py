import os
from girder.api.rest import Resource
from anonymousAccess import AnonymousAccess


class ReferenceApp(Resource):
    _cp_config = {'tools.staticdir.on': True,
                  'tools.staticdir.index': 'index.html'}

    def __init__(self):
        super(ReferenceApp, self).__init__()
        self.resourceName = 'referenceapp'


def load(info):
    ReferenceApp._cp_config['tools.staticdir.dir'] = os.path.join(
        os.path.relpath(info['pluginRootDir'],
                        info['config']['/']['tools.staticdir.root']),
        'web_client')

    # Move girder app to /girder, serve sumo app from /
    info['apiRoot'].referenceapp = ReferenceApp()

    (
        info['serverRoot'],
        info['serverRoot'].girder
    ) = (
        info['apiRoot'].referenceapp,
        info['serverRoot']
    )

    info['serverRoot'].api = info['serverRoot'].girder.api
    anonymousAccess = AnonymousAccess()
    info['apiRoot'].item.route('GET', ('privateItem', ), anonymousAccess.getOrMakePrivateItem)
    info['apiRoot'].item.route('GET', ('scratchItem', ), anonymousAccess.makeScratchItem)
    info['apiRoot'].folder.route('GET', ('privateFolder', ), anonymousAccess.getOrMakePrivateFolder)
    info['apiRoot'].folder.route('GET', ('publicFolder', ), anonymousAccess.getOrMakePublicFolder)
    info['apiRoot'].item.route('POST', (':id', 'togglePublic'), anonymousAccess.togglePublic)
    info['apiRoot'].item.route('POST', (':id', 'updateScratch'), anonymousAccess.updateScratchItem)
    info['apiRoot'].item.route('GET', (':id', 'info'), anonymousAccess.itemInfo)
    info['apiRoot'].item.route('GET', ('validateScratchItems', ), anonymousAccess.validateScratchItems)
    info['apiRoot'].item.route('PUT', ('adoptScratchItems', ), anonymousAccess.adoptScratchItems)
