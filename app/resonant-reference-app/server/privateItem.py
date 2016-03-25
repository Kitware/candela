from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource, RestException

class PrivateItem(Resource):
    @access.user
    @describeRoute(
        Description('''Gets or creates an item with the supplied
        name in the current user's private folder. Also creates
        the Private folder if it is missing.''')
        .param('name', 'The name of the item.', required=True)
        .param('description', 'The description of the item.', required=False)
        .errorResponse()
    )
    def getOrMakePrivateItem(self, params):
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
        privateItem = self.model('item').createItem(name=params['name'],
            creator=user, folder=privateFolder,
            description=params.get('description', ''), reuseExisting=True)

        return privateItem