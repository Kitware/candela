import subprocess
from pluginDir import pluginDir
from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource


class Versioning(Resource):
    @access.public
    @describeRoute(
        Description('Get Resonant Lab\'s current version number.')
        .notes(' Note that, for now, this actually will return the current branch name. ' +
               'In the future, this will return a number if the branch is "master", ' +
               '"release", or there is no git branch information (see issue #255)')
        .errorResponse()
    )
    def versionNumber(self, params):
        return 'master'

        # TODO: instead of "master", return (and use) actual version numbers
        #
        # TODO: remove this logic altogether. A semver/semantic-release kind of
        # automated release cycle should eliminate most of the need for this
        # versioning scheme.
        try:
            # Try to figure out what git branch we're on... TODO: if this fails
            # for whatever reason, return the actual version number instead
            statusText = subprocess.check_output(['git', 'status'], cwd=pluginDir())
            branch = statusText.split('\n')[0].replace('On branch ', '')
            if branch == 'master' or branch == 'release' or branch == '':
                return 'master'
            else:
                return branch
        except Exception:
            return 'master'
