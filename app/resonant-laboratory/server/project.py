from versioning import Versioning
from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource, RestException, loadmodel
from girder.constants import AccessType
from girder.plugins.girder_db_items.rest import DatabaseItemResource
from girder.plugins.girder_db_items.dbs.mongo import MongoConnector
from girder_worker.format import get_csv_reader


class ProjectItem(Resource):
    def __init__(self, info):
        self.versioning = Versioning()

    @access.public
    @loadmodel(model='item', level=AccessType.WRITE)
    @describeRoute(
        Description('Set or modify project dataset information')
        .param('id', 'The ID of the item.', paramType='path')
        .errorResponse()
    )
    def setupProject(self, item, params):
        metadata = item.get('meta', {})
        rlab = metadata.get('rlab', {})

        rlab['itemType'] = 'project'
        rlab['versionNumber'] = self.versioning.versionNumber({})

        rlab['datasets'] = []
        rlab['matchings'] = []
        rlab['visualizations'] = []
        rlab['preferredWidgets'] = []

        metadata['rlab'] = rlab
        item['meta'] = metadata
        return self.model('item').updateItem(item)
