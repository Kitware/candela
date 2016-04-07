import md5, random, sys
from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource, RestException, loadmodel
from girder.constants import AccessType

class AnonymousAccess(Resource):
    def _getAnonymousUser(self):
        try:
            return list(self.model('user').textSearch('anonymous'))[0]
        except:
            # Create the anonymous user if it doesn't exist
            
            # Use some random password; though users that aren't
            # logged in can trigger the creation of this account,
            # only the admin should be able to change the anonymous
            # user's settings
            password = str(random.randint(-sys.maxint-1,sys.maxint))
            password = md5.md5(password).hexdigest()
            
            return self.model('user').createUser(
                login='anonymous',
                password=password,
                email='anonymous@example.com',
                firstName='Anonymous',
                lastName='Account',
                admin=False)
    
    @access.user
    @describeRoute(
        Description('''Gets the user's Private folder.
        Creates it if it is missing.''')
        .errorResponse()
    )
    def getOrMakePrivateFolder(self, params):
        user = self.getCurrentUser()
        
        # Sneaky way to get the private folder without looking it up
        # (also creates it if it doesn't exist)
        return self.model('folder').createFolder(parent=user,
            name='Private', parentType='user', public=False,
            creator=user, reuseExisting=True)
    
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

        privateFolder = self.getOrMakePrivateFolder({})

        if params.has_key('reuseExisting'):
            noreuse = params['reuseExisting']
            if isinstance(noreuse, str):
                noreuse = noreuse.lower() not in ['false', '0', 'f', 'n', 'no']
            reuseExisting = noreuse is not False
        else:
            reuseExisting = True
        
        privateItem = self.model('item').createItem(name=params['name'],
            creator=user, folder=privateFolder,
            description=params.get('description', ''),
            reuseExisting=reuseExisting)

        return privateItem
    
    @access.public
    @describeRoute(
        Description('''Gets the user's Public folder. If the
        user is not logged in, the anonymous user's Public
        folder is returned. Creates the folder if it is missing.''')
        .errorResponse()
    )
    def getOrMakePublicFolder(self, params):
        user = self.getCurrentUser()
        
        if user is None:
            user = self._getAnonymousUser()
        
        return self.model('folder').createFolder(parent=user,
            name='Public', parentType='user', public=True,
            creator=user, reuseExisting=True)
    
    @access.public
    @describeRoute(
        Description('''Create a new item, either in the
        current user's Private folder (created if non-existent),
        or in the anonymous user's Public folder if the user
        is not logged in''')
        .param('name', 'The name of the item.', required=True)
        .param('description', 'The description of the item.', required=False)
        .errorResponse()
    )
    def getOrMakeScratchItem(self, params):
        user = self.getCurrentUser()
        
        if user is not None:
            params['reuseExisting'] = False
            return self.getOrMakePrivateItem(params)
        else:
            user = self._getAnonymousUser();
            
            publicFolder = self.getOrMakePublicFolder({})
            
            # Do the same thing with the item
            return self.model('item').createItem(name=params['name'],
                folder=publicFolder, description=params.get('description', ''),
                creator=user, reuseExisting=False)
    
    @access.public
    @loadmodel(model='item', level=AccessType.READ)
    @describeRoute(
        Description('''Attempt to update an item. If the user does
        not have write access, a copy is made in the user's Private
        directory, or the anonymous user's Public folder if the user
        is not logged in''')
        .param('id', 'The ID of the item.', paramType='path')
        .param('name', 'Name for the item.', required=False)
        .param('description', 'Description for the item.', required=False)
        .param('body', 'A JSON object containing the metadata keys to add',
              paramType='body')
        .errorResponse()
    )
    def updateScratchItem(self, item, params):        
        params['name'] = params.get('name', item['name']).strip()
        params['description'] = params.get('description',
            item['description']).strip()
        
        metadata = item.get('meta', {})
        metaOverrides = self.getBodyJson()
        if metaOverrides is not None:
            for k, v in metaOverrides.iteritems():
                if v is None:
                    if metadata.has_key(k):
                        del metadata[k]
                else:
                    metadata[k] = v
        
        user = self.getCurrentUser()
        
        if user is None:
            user = self._getAnonymousUser()
        
        try:
            targetItem = self.model('item').load(item['_id'],
                level=AccessType.WRITE, user=user, exc=True)
        except:
            targetItem = None
        
        if targetItem is not None:
            targetItem['name'] = params['name']
            targetItem['description'] = params['description']
        else:
            targetItem = self.getOrMakeScratchItem(params)
        
        targetItem['meta'] = metadata
        
        self.model('item').updateItem(targetItem)
        
        return targetItem

    @access.public
    @loadmodel(model='item', level=AccessType.READ)
    @describeRoute(
        Description('''Moves an item is to the user's
        Public or Private folder. If the user does not have write
        access to the indicated item, a copy is made instead (of
        course, read access to the original is necessary). If the
        user is not logged in, the item is copied to the anonymous
        user's Public folder''')
        .param('id', 'The ID of the item.', paramType='path')
        .param('makePublic', '''If true, moves the item to the
        Public folder, regardless of its current location''', required=False)
        .param('forceCopy', '''If true, copy the item instead
        of moving it''', required=False)
        .errorResponse()
    )
    def togglePublic(self, item, params):
        user = self.getCurrentUser()
        anonymous = False
        if user is None:
            anonymous = True
            user = self._getAnonymousUser()
        
        currentFolder = self.model('folder').load(
            item['folderId'], user=user,
            level=AccessType.READ, exc=True)
        
        if params.has_key('makePublic'):
            pub = params['makePublic']
            if isinstance(pub, str):
                pub = pub.lower() in ['true', '1', 't', 'y', 'yes']
            makePublic = pub is True
        else:
            makePublic = currentFolder['name'] == 'Private'
        
        if params.has_key('forceCopy'):
            fc = params['forceCopy']
            if isinstance(fc, str):
                fc = fc.lower() in ['true', '1', 't', 'y', 'yes']
            forceCopy = fc is True
        else:
            forceCopy = False
        
        if anonymous is True:
            makePublic = True
            forceCopy = True
        
        if makePublic is True:
            targetFolder = self.getOrMakePublicFolder({})
        else:
            targetFolder = self.getOrMakePrivateFolder({})
        
        if currentFolder['_id'] != targetFolder['_id']:
            if forceCopy is True:
                item = self.model('item').copyItem(srcItem=item,
                    creator=user, folder=targetFolder)
            else:
                self.model('item').move(item, targetFolder)
        
        return item