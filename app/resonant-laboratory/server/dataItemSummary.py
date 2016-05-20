import copy
import bson.json_util
from pymongo import MongoClient
from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource, RestException, loadmodel
from girder.constants import AccessType
from girder.plugins.girder_db_items.rest import DatabaseItemResource
from girder.plugins.girder_db_items.dbs.mongo import MongoConnector


class DataItemSummary(Resource):
    def __init__(self, info):
        super(Resource, self).__init__()
        self.databaseItemResource = DatabaseItemResource(info['apiRoot'])

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
            if item['databaseMetadata']['type'] == 'mongo':
                return self.inferMongoSchema(item, params)
            else:
                raise RestException('Schema inference for ' +
                                    item['databaseMetadata']['type'] +
                                    ' databases is not yet supported')
        else:
            raise RestException('Schema inference for flat file items' +
                                ' is not yet supported')

    @access.public
    @loadmodel(model='item', level=AccessType.READ)
    @describeRoute(
        Description('Get histograms for the data in an item')
        .param('id', 'The ID of the item.', paramType='path')
        .param('filterQuery',
               'Get histograms after the results of these filters. ' +
               'TODO: describe the ' +
               'filter format used in the girder_db_items plugin.',
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
        if 'databaseMetadata' in item:
            if item['databaseMetadata']['type'] == 'mongo':
                return self.getMongoHistograms(item, params)
            else:
                raise RestException('Histogram calculation for ' +
                                    item['databaseMetadata']['type'] +
                                    ' databases is not yet supported')
        else:
            raise RestException('Histogram calculation for flat file items' +
                                ' is not yet supported')

    @access.public
    @loadmodel(model='item', level=AccessType.READ)
    @describeRoute(
        Description('Filter the data in the item. Returns data formatted as a JSON list of dicts')
        .param('id', 'The ID of the item.', paramType='path')
        .param('limit', 'Result set size limit (default=50).',
               required=False, dataType='int')
        .param('offset', 'Offset into result set (default=0).',
               required=False, dataType='int')
        .param('sort', 'Either a field to sort the results by or a JSON list '
               'of multiple fields and directions for sorting the results '
               '(e.g., [["field1", 1], ["field2", -1]])', required=False)
        .param('sortdir', '1 for ascending, -1 for descending (default=1).  '
               'Ignored if sort is unspecified or is a JSON list.',
               required=False, dataType='int')
        .param('fields', 'A comma-separated or JSON list of fields (column '
               'names) to return (default is all fields).  If a JSON list is '
               'used, instead of a plain string, a field may be a dictionary '
               'with a function definition and an optional "reference" entry '
               'which is used to identify the resultant column.',
               required=False)
        .param('filters', 'A JSON list of filters to apply to the data.  Each '
               'entry in the list can be either a list or a dictionary.  If a '
               'list, it contains [(field), (operator), (value)], where '
               '(operator) is optional.  If a dictionary, at least the '
               '"field" and "value" keys must contain values, and "operator" '
               'and "function" keys can also be added.', required=False)
        .param('clientid', 'A string to use for a client id.  If specified '
               'and there is an extant query to this end point from the same '
               'clientid, the extant query will be cancelled.', required=False)
        .param('wait', 'Maximum duration in seconds to wait for data '
               '(default=0).  If a positive value is specified and the '
               'initial query returns no results, the query will be repeated '
               'every (poll) seconds until this time elapses or there are '
               'some results.', required=False, dataType='float', default=0)
        .param('poll', 'Minimum interval in seconds between checking for data '
               'when waiting (default=10).', required=False, dataType='float',
               default=10)
        .param('initwait', 'When waiting, initial delay in seconds before '
               'starting to poll for more data.  This is not counted as part '
               'of the wait duration (default=0).', required=False,
               dataType='float', default=0)
        .notes('Instead of or in addition to specifying a filters parameter, '
               'additional query parameters of the form (field)[_(operator)]='
               '(value) can be used.  '
               'Operators depend on the data type of the field, and include = '
               '(no operator or eq), != (<>, ne), >= (min, gte), <= (lte), > '
               '(gt), < (max, lt), in, notin, ~ (regex), ~* (search -- '
               'typically a case insensitive regex or word-stem search), !~ '
               '(notregex), !~* (notsearch).  '
               'If the backing database connector supports it, any place a '
               'field can be used can be replaced with a function reference.  '
               'This is a dictionary with "func" or with the name of the '
               'database function and "params" which is a list of values, '
               'fields, or functions to pass to the function.  If the param '
               'entry is not a dictionary, it is treated as a value.  If a '
               'dictionary, it can contain "value", "field", or "func" and '
               '"param".')
        .errorResponse('ID was invalid.')
        .errorResponse('Read access was denied for the item.', 403)
        .errorResponse('Item is not a database link.')
        .errorResponse('Failed to connect to database.')
        .errorResponse('The sort parameter must be a JSON list or a known '
                       'field name.')
        .errorResponse('Sort must use known fields.')
        .errorResponse('The fields parameter must be a JSON list or a '
                       'comma-separated list of known field names.')
        .errorResponse('Fields must use known fields.')
        .errorResponse('The filters parameter must be a JSON list.')
        .errorResponse('Filters in list-format must have two or three '
                       'components.')
        .errorResponse('Unknown filter operator')
        .errorResponse('Filters must be on known fields.')
        .errorResponse('Cannot use operator on field')
        .errorResponse()
    )
    def filterData(self, item, params):
        if 'databaseMetadata' in item:
            params['format'] = 'dict'
            selectResult = self.databaseItemResource.databaseSelect(id=item['_id'], params=params)
            return bson.json_util.loads(list(selectResult())[0])['data']
        else:
            raise RestException('filterData for flat file items' +
                                ' is not yet supported')

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
        mr_result = collection.inline_map_reduce("""
function () {
  var keys = this;
  for (var key in keys) {
    var value = keys[key];
    var dataType = typeof value;

    var dataTypes = {};
    dataTypes[dataType] = {
      count: 1
    };
    if (dataType === 'string' ||
      dataType === 'number') {
      dataTypes[dataType].min = value;
      dataTypes[dataType].max = value;
    }
    emit(key, dataTypes);
  }
}
                                                 """,
                                                 """
function (key, values) {
  var dataTypes = {};
  values.forEach(function (value) {
    var dataType;
    for (dataType in value) {
      if (!dataTypes.hasOwnProperty(dataType)) {
        dataTypes[dataType] = {
          count: 0
        };
        if (dataType === 'string' || dataType === 'number') {
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
        id: 573dd325ed27aa873ea6a63a
        (nci)

        filterQuery:
        [{"field":"Metal","operator":"=","value":1},{"field":"Molecular Weight","operator":">=","value":100}]
        {"$and":[{"Metal":{"$eq":1}},{"Molecular Weight":{"$gte":100}}]}

        categoricalAttrs:
        CuratedBy,Agglomerated,Metal,IsCrystalline,Lipid

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
                if histogramRange == 0:
                    raise RestException('Min and max are the same for ' + attr +
                                        '; should this be a categorical attribute?')
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
                divisions = spec['binCount'] - 1
                for result in results[attr]:
                    result['lowBound'] = (result['_id'] / divisions) * \
                        histogramRange + spec['min']
                    result['highBound'] = ((result['_id'] + 1) / divisions) * \
                        histogramRange + spec['min']

        return results
