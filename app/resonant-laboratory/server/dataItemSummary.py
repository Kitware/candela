import copy
import bson.json_util
from pymongo import MongoClient
from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource, RestException, loadmodel
from girder.constants import AccessType

class DataItemSummary(Resource):

    @access.public
    @loadmodel(model='item', level=AccessType.READ)
    @describeRoute(
        Description('Infer the schema for the data in an item')
        .param('id', 'The ID of the item.', paramType='path')
        # TODO: add a parameter for selecting the root
        .errorResponse()
    )
    def inferSchema(self, item, params):
        if 'databaseMetadata' in item:
            return self.inferMongoSchema(item, params)
        else:
            return self.inferFlatFileSchema(item, params)

    @access.public
    @loadmodel(model='item', level=AccessType.READ)
    @describeRoute(
        Description('Get histograms for the data in an item')
        .param('id', 'The ID of the item.', paramType='path')
        .param('filterQuery',
               'Get histograms after the results of this JSON mongo query. ' +
               'Note that this parameter is ignored if the item is not a ' +
               'mongo database item',
               required=False)
        .param('categoricalAttrs',
               'A comma-separated list of categorical attributes to count',
               required=False)
        .param('quantitativeAttrs',
               'A JSON dict of quantitative attribute-dict pairs, where ' +
               'the dict contains numbers for min, max, and binCount.',
               required=False)
        .errorResponse()
    )
    def getHistograms(self, item, params):
        # What kind of item are we dealing with?
        if 'databaseMetadata' in item:
            return self.getMongoHistograms(item, params)
        else:
            return self.getFlatFileHistograms(item, params)

    def getMongoHistograms(self, item, params):
        """
        Debugging parameters:
        id: 5739ce44acef4a1d4bc1303e
        (restaurants)

        filterQuery:
        {"$or":[{"meta.p1a.image.meta.localization":"l arm"},{"meta.p1a.image.meta.localization":"r arm"}]}

        categoricalAttrs:
        meta.p1a.image.meta.gender,meta.p1a.image.meta.localization

        quantitativeAttrs:
        {"meta.p1a.image.meta.age":{"min":0,"max":100,"binCount":10}}
        """

        # Establish the connection to the mongodb
        dbMetadata = item['databaseMetadata']
        conn = MongoClient(dbMetadata['url'])
        items = conn[dbMetadata['database']][dbMetadata['collection']]

        # A dict to store the results of aggregation
        results = {}

        # Now assemble our aggregation pipeline:

        # TODO: only include results that the user is allowed to access
        # (how to use girder authentication for a different db?)
        # dbIds = self.getDatasetIds(params['collection'])
        # pipelineBase = [{
        #    '$match': {'folderId': {'$in': dbIds}}
        # }]
        pipelineBase = []

        # If filters have been applied, narrow our scope even further
        if 'filterQuery' in params:
            query = bson.json_util.loads(params['filterQuery'])
            if query:
                pipelineBase.append({
                    '$match': query
                })

        # Count how many items match the filters across the database
        pipeline = copy.deepcopy(pipelineBase)
        pipeline.append({
            '$group': {
                '_id': None,
                'totalCount': {'$sum': 1}
            }
        })
        try:
            temp = next(items.aggregate(pipeline))
        except StopIteration:
            return {
                'Total Size': 0
            }
        results['Total Count'] = temp['totalCount']

        # Create and run pipelines for each categorical attribute
        if 'categoricalAttrs' in params:
            for attr in params['categoricalAttrs'].split(','):
                pipeline = copy.deepcopy(pipelineBase)
                pipeline.append({
                    '$project': {attr: 1}
                })
                pipeline.append({
                    '$group': {
                        '_id': '$' + attr,
                        'count': {
                            '$sum': 1
                        }
                    }
                })
                results[attr] = list(items.aggregate(pipeline))

        # Create and run pipelines for each quantitative attribute
        if 'quantitativeAttrs' in params:
            quantitativeAttrs = bson.json_util.loads(params['quantitativeAttrs'])
            for attr, spec in quantitativeAttrs.iteritems():
                pipeline = copy.deepcopy(pipelineBase)
                pipeline.append({
                    '$match': {
                        attr: {'$type': 'number'}
                    }
                })
                histogramRange = spec['max'] - spec['min']
                pipeline.append({
                    '$project': {
                        'binIndex': {
                            '$floor': {
                                '$multiply': [
                                    {
                                        '$divide': [
                                            {
                                                '$subtract': [
                                                    '$' + attr, spec['min']
                                                ]
                                            },
                                            histogramRange
                                        ]
                                    },
                                    spec['binCount']
                                ]
                            }
                        }
                    }
                })
                pipeline.append({
                    '$group': {
                        '_id': '$binIndex',
                        'count': {
                            '$sum': 1
                        }
                    }
                })
                results[attr] = list(items.aggregate(pipeline))
                for result in results[attr]:
                    result['lowBound'] = (result['_id'] / spec['binCount']) * \
                        histogramRange + spec['min']
                    result['highBound'] = ((result['_id'] + 1) / spec['binCount']) * \
                        histogramRange + spec['min']

        return results
