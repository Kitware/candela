import sys, json
from girder.constants import AccessType
from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource, RestException, filtermodel, loadmodel

class ReadableString(str):
    def read(self, bytes=None):
        return self

class RRAUser(Resource):
    def getOrMakePreferencesItem(self):
        user = self.getCurrentUser()
        
        try:
            assetstore = self.model('assetstore').getCurrent()
        except:
            raise RestException("No assetstore configured")
        
        # Sneaky way to get the private folder without looking it up
        # (also creates it if it doesn't exist)
        privateFolder = self.model('folder').createFolder(parent=user,
            name='Private', parentType='user', public=False,
            creator=user, reuseExisting=True)
        
        # Do the same thing with the item
        prefsItem = self.model('item').createItem(name="rra_preferences",
            creator=user, folder=privateFolder, description='''
            Contains your preferences for the Reference application. If
            you move or delete this item, your preferences will be lost.
            ''', reuseExisting=True)
        
        return prefsItem
    
    @access.user
    @describeRoute(
        Description('Set the current user\'s Reference App preferences')
        .param('preferences', '''JSON dictionary of preferences
                        for the reference app''', required=True)
        .errorResponse()
    )
    def setRRAPreferences(self, params):
        prefsItem = self.getOrMakePreferencesItem()
        try:
            preferences = {
                'rra_preferences': json.loads(params['preferences'])
            }
        except:
            raise RestException('Attempted to upload invalid JSON')
        return self.model('item').setMetadata(prefsItem, preferences)
    
    @access.user
    @describeRoute(
        Description('Get the user\'s Reference App preferences')
        .errorResponse()
    )
    def getRRAPreferences(self, params):
        prefsItem = self.getOrMakePreferencesItem()
        if prefsItem is None:
            return None
        return prefsItem.get('meta', {}).get('rra_preferences')