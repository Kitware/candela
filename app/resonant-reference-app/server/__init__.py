import os
from girder.api.rest import Resource
from currentUser import CurrentUser


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

    currentUser = CurrentUser()
    info['apiRoot'].item.route(
        'GET', ('privateItem', ), currentUser.getOrMakePrivateItem)
    info['apiRoot'].folder.route(
        'GET', ('privateFolder', ), currentUser.getOrMakePrivateFolder)
    info['apiRoot'].folder.route(
        'GET', ('publicFolder', ), currentUser.getOrMakePublicFolder)
    info['apiRoot'].item.route(
        'POST', ('togglePublic', ':id'), currentUser.togglePublic)
