

class CustomAppRoot:
    exposed = True

    def GET(self):
        return """
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Resonant Reference App</title>
    <link rel="stylesheet"
          href="//fonts.googleapis.com/css?family=Droid+Sans:400,700">
    <link rel="stylesheet" href="static/lib/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="static/lib/fontello/css/fontello.css">
    <link rel="stylesheet" href="static/lib/fontello/css/animation.css">
    <link rel="stylesheet" href="static/built/app.min.css">
    <link rel="icon" type="image/png" href="static/img/Girder_Favicon.png">
</head>
<body>
    <div id="g-global-info-apiroot" class="hide">api/v1</div>
    <div id="g-global-info-staticroot" class="hide">static</div>
    <div class="hmy-content"></div>
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
