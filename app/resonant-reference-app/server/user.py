import json
from girder.constants import AccessType
from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource, RestException, filtermodel, loadmodel

class RRAUser(Resource):
    @access.user
    @describeRoute(
        Description('Set the current user\'s Reference App preferences')
        .param('preferences', '''JSON dictionary of preferences
                        for the reference app''', required=True)
        .errorResponse()
    )
    def setRRAPreferences(self, params):
        user = self.getCurrentUser()
        user['rra_preferences'] = json.loads(params['preferences'])
        return self.model('user').save(user)
    
    @access.user
    @describeRoute(
        Description('Get the user\'s Reference App preferences')
        .errorResponse()
    )
    def getRRAPreferences(self, params):
        user = self.getCurrentUser()
        return user.get('rra_preferences', None)