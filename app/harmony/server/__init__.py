

class CustomAppRoot(object):
    exposed = True

    def GET(self):
        return '<script src="static/built/plugins/harmony/extra/harmony.js"></script>'


def load(info):
    # Move girder app to /girder, serve our custom app from /
    info['serverRoot'], info['serverRoot'].girder = (CustomAppRoot(),
                                                     info['serverRoot'])
    info['serverRoot'].api = info['serverRoot'].girder.api
