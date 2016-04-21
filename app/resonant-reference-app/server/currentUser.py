from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource, RestException, loadmodel
from girder.constants import AccessType

class CurrentUser(Resource):
    @access.user
    @describeRoute(
        Description('''Gets or creates an item with the supplied
        name in the current user's Private folder. Also creates
        the Private folder if it is missing.''')
        .param('name', 'The name of the item.', required=True)
        .param('description', 'The description of the item.', required=False)
        .param('reuseExisting', '''If false, create a new item,
        even if an existing item of the same name already exists''', required=False)
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

        # Do the same thing with the item (optionally don't reuse
        # the existing item if it has the same name)
        if params.has_key('reuseExisting'):
            reuseExisting = params['reuseExisting'].lower() not in ['false', '0', 'f', 'n', 'no']
        else:
            reuseExisting = True
        
        privateItem = self.model('item').createItem(name=params['name'],
            creator=user, folder=privateFolder,
            description=params.get('description', ''),
            reuseExisting=reuseExisting)

        return privateItem
    
    @access.user
    @describeRoute(
        Description('''Gets or creates the user's Private folder.
        Creates it if it is missing.''')
        .errorResponse()
    )
    def getOrMakePrivateFolder(self, params):
        user = self.getCurrentUser()
        
        return self.model('folder').createFolder(parent=user,
            name='Private', parentType='user', public=False,
            creator=user, reuseExisting=True)
    
    @access.user
    @describeRoute(
        Description('''Gets or creates the user's Public folder.
        Creates it if it is missing.''')
        .errorResponse()
    )
    def getOrMakePublicFolder(self, params):
        user = self.getCurrentUser()
        
        return self.model('folder').createFolder(parent=user,
            name='Public', parentType='user', public=True,
            creator=user, reuseExisting=True)
    
    @access.user
    @loadmodel(model='item', level=AccessType.WRITE)
    @describeRoute(
        Description('''Switches whether an item is in the user's
        public or private folder.''')
        .param('id', 'The ID of the item.', paramType='path')
        .param('makePublic', 'If true, moves the item to the Public folder', required=False)
        .errorResponse()
    )
    def togglePublic(self, item, params):
        user = self.getCurrentUser()
        
        currentFolder = self.model('folder').load(
            item['folderId'], user=self.getCurrentUser(),
            level=AccessType.WRITE, exc=True)
        
        if params.has_key('makePublic'):
            makePublic = params['makePublic'].lower() in ['true', '1', 't', 'y', 'yes']
        else:
            makePublic = currentFolder['name'] == 'Private'
        
        if makePublic is True:
            targetFolder = self.getOrMakePublicFolder({})
        else:
            targetFolder = self.getOrMakePrivateFolder({})
        
        if currentFolder['_id'] != targetFolder['_id']:
            self.model('item').move(item, targetFolder)
        
        return makePublic