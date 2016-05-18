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

    def getMongoCollection(self, item):
        dbMetadata = item['databaseMetadata']
        conn = MongoClient(dbMetadata['url'])
        return conn[dbMetadata['database']][dbMetadata['collection']]

    def inferMongoSchema(self, item, params):
        # TODO: there's a chance someone has done this more
        # efficiently. Javascript solutions I found:
        # Variety: https://github.com/variety/variety
        # mongodb-schema: https://github.com/mongodb-js/mongodb-schema
        collection = self.getMongoCollection(item)
        mr_result = collection.inline_map_reduce(
          """
            function() {
              var keys = this;
              for (var key in keys) {
                var value = keys[key];
                var dataType = typeof value;
                key = key.replace(/\d+/g,'XX');

                dataTypes = {};
                dataTypes[dataType] = {
                  count: 1
                };
                if (dataType === 'string' ||
                  dataType === 'number') {
                  dataTypes[dataType].min = value;
                  dataTypes[dataType].max = value;
                };
                emit(key, dataTypes);
              }
            }
          """,
          """
            function(key, values) {
              var dataTypes = {};
        	  values.forEach(function(value) {
                for (dataType in value) {
                  if (!dataTypes.hasOwnProperty(dataType)) {
                    dataTypes[dataType] = {
                      count: 0
                    };
                    if (dataType === 'string' ||
                      dataType === 'number') {
                      dataTypes[dataType].min = value[dataType].min;
                      dataTypes[dataType].max = value[dataType].max;
                    }
                  }
                  dataTypes[dataType].count += value[dataType].count;
                  if (dataType === 'string' || dataType === 'number') {
                    dataTypes[dataType].min = value[dataType].min < dataTypes[dataType].min ? value[dataType].min : dataTypes[dataType].min;
                    dataTypes[dataType].max = value[dataType].max > dataTypes[dataType].max ? value[dataType].max : dataTypes[dataType].max;
                  }
                }
        	  });

        	  return dataTypes;
            }
          """)
        # rearrange into a neater dict before sending it back
        result = {}
        for r in mr_result:
            result[r['_id']] = r['value']
        return result

    def getMongoHistograms(self, item, params):
        """
        Debugging parameters:
        id: 573b110ded27aa29547adeb5
        (nci)

        filterQuery:
        {"$or":[{"Metal":{"$eq":1}},{"IsCrystalline":{"$eq":1}}]}

        categoricalAttrs:
        Agglomerated,Metal,IsCrystalline,Lipid

        quantitativeAttrs:
        {"Molecular Weight":{"min":0,"max":1000000,"binCount":10}}
        """

        # Establish the connection to the mongodb
        collection = self.getMongoCollection(item)

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

        # Count how many data items match the filters across the database
        pipeline = copy.deepcopy(pipelineBase)
        pipeline.append({
            '$group': {
                '_id': None,
                'totalCount': {'$sum': 1}
            }
        })

        try:
            temp = next(collection.aggregate(pipeline))
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
                results[attr] = list(collection.aggregate(pipeline))

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
                results[attr] = list(collection.aggregate(pipeline))
                for result in results[attr]:
                    result['lowBound'] = (result['_id'] / spec['binCount']) * \
                        histogramRange + spec['min']
                    result['highBound'] = ((result['_id'] + 1) / spec['binCount']) * \
                        histogramRange + spec['min']

        return results
