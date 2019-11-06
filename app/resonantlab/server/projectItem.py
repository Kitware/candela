from anonymousAccess import loadAnonymousItem
from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource, RestException, loadmodel
from girder.constants import AccessType
# from girder.plugins.database_assetstore.dbs.mongo import MongoConnector
# from girder_worker.format import get_csv_reader


class ProjectItem(Resource):
    def __init__(self, app):
        super(Resource, self).__init__()
        self.app = app

    @access.public
    @loadAnonymousItem()
    @describeRoute(
        Description('Set or modify item project information')
        .param('id', 'The ID of the item.', paramType='path')
        .errorResponse()
    )
    def setupProject(self, item, params, user):
        metadata = item.get('meta', {})
        rlab = metadata.get('rlab', {})

        rlab['itemType'] = 'project'
        rlab['versionNumber'] = self.app.versioning.versionNumber({})

        rlab['datasets'] = rlab.get('datasets', [])
        rlab['matchings'] = rlab.get('matchings', [])
        rlab['visualizations'] = rlab.get('visualizations', [])
        rlab['preferredWidgets'] = rlab.get('preferredWidgets', [])

        metadata['rlab'] = rlab
        item['meta'] = metadata
        return self.model('item').updateItem(item)
