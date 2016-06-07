import os
import subprocess
from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource, RestException, loadmodel


class Versioning(Resource):
    @access.public
    @describeRoute(
        Description('Get Resonant Laboratory\'s current version number.')
        .notes(' Note that, for now, this actually will return the current branch name. ' +
               'In the future, this will return a number if the branch is "master", ' +
               '"release", or there is no git branch information (see issue #255)')
        .errorResponse()
    )
    def versionNumber(self, params):
        # TODO: instead of "master", return (and use) actual version numbers
        try:
            # Try to figure out what git branch we're on... TODO: if this fails
            # for whatever reason, return the actual version number instead
            currentPath = subprocess.check_output(['girder-install', 'plugin-path']).strip()
            cwd = os.path.join(currentPath, 'resonant-laboratory')
            statusText = subprocess.check_output(['git', 'status'], cwd=cwd)
            branch = statusText.split('\n')[0].replace('On branch ', '')
            if branch == 'master' or branch == 'release' or branch == '':
                return 'master'
            else:
                return branch
        except e:
            return 'master'
