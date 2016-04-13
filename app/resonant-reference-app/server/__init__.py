from anonymousAccess import AnonymousAccess

class CustomAppRoot:
    exposed = True

    def GET(self):
        return """
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Resonant Reference App</title>
    <link href='https://fonts.googleapis.com/css?family=Cutive+Mono|Gentium+Basic:400,700' rel='stylesheet' type='text/css'>
    <link rel="icon" type="image/png" href="static/img/Girder_Favicon.png">
</head>
<body>
    <header id="Header"></header>
    <div id="WidgetPanels" class="accordion"></div>
    <div id="Overlay"></div>
    <div id="Tooltip"></div>
    <script src="static/built/libs.min.js"></script>
    <script src="static/built/app.min.js"></script>
    <script src="static/built/plugins/resonant-reference-app/extra/webpack_bundle.js"></script>
</body>
"""

def load(info):
    # Move girder app to /girder, serve our custom app from /
    info['serverRoot'], info['serverRoot'].girder = (CustomAppRoot(),
                                                     info['serverRoot'])
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
