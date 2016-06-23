import md5
import random
import sys
import json
import six
from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource, RestException, loadmodel
from girder.constants import AccessType
from girder.models.model_base import AccessException


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
            password = str(random.randint(-sys.maxint - 1, sys.maxint))
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
        Description('Gets the user\'s Private folder.' +
                    ' Creates it if it is missing.')
        .errorResponse()
    )
    def getOrMakePrivateFolder(self, params):
        user = self.getCurrentUser()

        # Sneaky way to get the private folder without looking it up
        # (also creates it if it doesn't exist)
        return self.model('folder').createFolder(parent=user,
                                                 name='Private',
                                                 parentType='user',
                                                 public=False,
                                                 creator=user,
                                                 reuseExisting=True)

    @access.user
    @describeRoute(
        Description('Get or create a private item')
        .notes('Gets or creates an item with the supplied ' +
               'name in the current user\'s Private folder. Also ' +
               'creates the Private folder if it is missing.')
        .param('name', 'The name of the item.', required=True)
        .param('description', 'The description of the item.', required=False)
        .param('reuseExisting', 'If false, create a new item, even if an ' +
               'existing item of the same name already exists',
               required=False, dataType='boolean')
        .errorResponse()
    )
    def getOrMakePrivateItem(self, params):
        user = self.getCurrentUser()

        try:
            assetstore = self.model('assetstore').getCurrent()
        except:
            raise RestException("No assetstore configured")

        privateFolder = self.getOrMakePrivateFolder({})
        reuseExisting = params.get('reuseExisting', True)

        itemModel = self.model('item')
        privateItem = itemModel.createItem(name=params['name'],
                                           creator=user,
                                           folder=privateFolder,
                                           description=params.get(
            'description', ''),
            reuseExisting=reuseExisting)

        return privateItem

    @access.public
    @describeRoute(
        Description('Gets the user\'s Public folder.')
        .notes('If the user is not ' +
               'logged in, the anonymous user\'s Public folder is ' +
               'returned. Creates the folder if it is missing.')
        .errorResponse()
    )
    def getOrMakePublicFolder(self, params):
        user = self.getCurrentUser()

        if user is None:
            user = self._getAnonymousUser()

        return self.model('folder').createFolder(parent=user,
                                                 name='Public',
                                                 parentType='user',
                                                 public=True,
                                                 creator=user,
                                                 reuseExisting=True)

    @access.public
    @describeRoute(
        Description('Create a scratch item.')
        .notes('Create a new item, either in the current user\'s ' +
               'Private folder (created if non-existent), or in the ' +
               'anonymous user\'s Public folder if the user is ' +
               'not logged in')
        .param('name', 'The name of the item.', required=True)
        .param('description', 'The description of the item.', required=False)
        .errorResponse()
    )
    def makeScratchItem(self, params):
        user = self.getCurrentUser()

        if user is not None:
            params['reuseExisting'] = False
            return self.getOrMakePrivateItem(params)
        else:
            user = self._getAnonymousUser()

            publicFolder = self.getOrMakePublicFolder({})

            itemModel = self.model('item')
            return itemModel.createItem(name=params['name'],
                                        folder=publicFolder,
                                        description=params.get('description',
                                                               ''),
                                        creator=user,
                                        reuseExisting=False)

    @access.public
    @loadmodel(model='item', level=AccessType.READ)
    @describeRoute(
        Description('Get information about an item.')
        .notes('Get information about where an item is stored, as well ' +
               'as whether the user can write to the item.')
        .param('id', 'The ID of the item.', paramType='path')
        .errorResponse()
    )
    def itemInfo(self, item, params):
        info = {}

        anonUser = self._getAnonymousUser()
        user = self.getCurrentUser()
        if user is None:
            user = anonUser

        folder = self.model('folder').load(
            item['folderId'], user=user,
            level=AccessType.READ, exc=True)

        if item['baseParentType'] == 'user':
            if item['baseParentId'] == anonUser['_id']:
                info['location'] = 'PublicScratch'
            elif folder['public'] is True:
                info['location'] = 'PublicUser'
            else:
                info['location'] = 'PrivateUser'
        else:
            info['location'] = 'PublicLibrary'

        try:
            self.model('item').load(item['_id'],
                                    level=AccessType.WRITE,
                                    user=user,
                                    exc=True)
            info['editable'] = True
        except AccessException:
            info['editable'] = False

        return info

    @access.public
    @describeRoute(
        Description('Check whether items are in the public scratch space.')
        .notes('Validate that a specific set of items are in the public' +
               ' scratch space, and return those items')
        .param('ids', 'A JSON list of item IDs', required=True)
        .errorResponse()
    )
    def validateScratchItems(self, params):
        idList = json.loads(params['ids'])

        user = self.getCurrentUser()
        anonUser = self._getAnonymousUser()

        folderModel = self.model('folder')
        scratchFolder = folderModel.createFolder(parent=anonUser,
                                                 name='Public',
                                                 parentType='user',
                                                 public=True,
                                                 creator=anonUser,
                                                 reuseExisting=True)

        result = []
        for itemId in idList:
            try:
                item = self.model('item').load(itemId,
                                               level=AccessType.READ,
                                               user=user,
                                               exc=True)
            except AccessException:
                continue
            if item['folderId'] == scratchFolder['_id']:
                result.append(item)

        return result

    @access.public
    @describeRoute(
        Description('Take ownership of scratch items.')
        .notes('Attempt to move a set of items in the anonymous user\'s' +
               ' Public folder to the current user\'s Private folder. ' +
               'The list of items that were successfully adopted ' +
               'is returned.')
        .param('ids', 'A JSON list of item IDs', required=True)
        .errorResponse()
    )
    def adoptScratchItems(self, params):
        idList = json.loads(params['ids'])

        user = self.getCurrentUser()
        if user is None:
            return []
        privateFolder = self.getOrMakePrivateFolder({})

        anonUser = self._getAnonymousUser()

        result = []
        for itemId in idList:
            try:
                item = self.model('item').load(itemId,
                                               level=AccessType.WRITE,
                                               user=anonUser,
                                               exc=True)
                self.model('item').move(item, privateFolder)
                result.append(item)
            except AccessException:
                continue

        return result

    @access.public
    @loadmodel(model='item', level=AccessType.READ)
    @describeRoute(
        Description('Update a scratch item.')
        .notes('Attempt to update an item. If the user does not have ' +
               'write access, a copy is made in the user\'s Private ' +
               'directory, or the anonymous user\'s Public folder if ' +
               'the user is not logged in')
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
        rlabMetadata = metadata.get('rlab', {})
        metaOverrides = self.getBodyJson()
        if metaOverrides is not None:
            for k, v in metaOverrides.iteritems():
                if v is None:
                    if k in rlabMetadata:
                        del rlabMetadata[k]
                else:
                    rlabMetadata[k] = v

        user = self.getCurrentUser()
        anonymous = False
        if user is None:
            anonymous = True
            user = self._getAnonymousUser()

        try:
            targetItem = self.model('item').load(item['_id'],
                                                 level=AccessType.WRITE,
                                                 user=user,
                                                 exc=True)
        except AccessException as err:
            srcItem = self.model('item').load(item['_id'],
                                              level=AccessType.READ,
                                              user=user,
                                              exc=True)

            if anonymous:
                targetFolder = self.getOrMakePublicFolder({})
            else:
                targetFolder = self.getOrMakePrivateFolder({})

            targetItem = self.model('item').copyItem(srcItem=srcItem,
                                                     creator=user,
                                                     folder=targetFolder)

        targetItem['name'] = params['name']
        targetItem['description'] = params['description']

        metadata['rlab'] = rlabMetadata
        targetItem['meta'] = metadata

        self.model('item').updateItem(targetItem)

        return targetItem

    @access.public
    @loadmodel(model='item', level=AccessType.READ)
    @describeRoute(
        Description('Toggle the visibility of an item.')
        .notes('Moves an item is to the user\'s Public or Private ' +
               'folder. If the user does not have write access to the ' +
               'indicated item, a copy is made instead (of course, read' +
               ' access to the original is necessary). If the user is ' +
               'not logged in, the item is copied to the anonymous ' +
               'user\'s Public folder')
        .param('id', 'The ID of the item.', paramType='path')
        .param('makePublic', 'If true, moves the item to the Public folder, ' +
               'regardless of its current location',
               required=False, dataType='boolean')
        .param('forceCopy', 'If true, copy the item instead of moving it',
               required=False, dataType='boolean')
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

        makePublic = params.get('makePublic', currentFolder['name'] == 'Private')
        forceCopy = params.get('forceCopy', False)

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
                                                   creator=user,
                                                   folder=targetFolder)
            else:
                self.model('item').move(item, targetFolder)

        return item


class loadAnonymousItem(object):
    """
    This is a decorator that can be used to create a fallback scratch copy of an
    item if the user needs to WRITE when they only have READ access to the original.
    """
    def __call__(self, fun):
        @six.wraps(fun)
        def wrapped(self, *args, **kwargs):
            user = self.getCurrentUser()
            anonymous = False
            if user is None:
                anonymous = True
                user = self.app.anonymousAccess._getAnonymousUser()

            try:
                targetItem = self.app.anonymousAccess \
                    .model('item').load(kwargs['id'],
                                        level=AccessType.WRITE,
                                        user=user,
                                        exc=True)
            except AccessException as err:
                srcItem = self.app.anonymousAccess \
                    .model('item').load(kwargs['id'],
                                        level=AccessType.READ,
                                        user=user,
                                        exc=True)
                if anonymous:
                    targetFolder = self.app.anonymousAccess.getOrMakePublicFolder({})
                else:
                    targetFolder = self.app.anonymousAccess.getOrMakePrivateFolder({})

                targetItem = self.app.anonymousAccess \
                    .model('item').copyItem(srcItem=srcItem,
                                            creator=user,
                                            folder=targetFolder)
            kwargs['item'] = targetItem
            kwargs['user'] = user
            del kwargs['id']
            return fun(self, *args, **kwargs)
        return wrapped
