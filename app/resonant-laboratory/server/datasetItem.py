import copy
import bson.json_util
import subprocess
import os
import functools
import inspect
import csv
from pymongo import MongoClient
from versioning import Versioning
from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource, RestException, loadmodel
from girder.constants import AccessType
from girder.plugins.girder_db_items.rest import DatabaseItemResource
from girder.plugins.girder_db_items.dbs.mongo import MongoConnector
from girder_worker.format import get_csv_reader


class DatasetItem(Resource):
    def __init__(self, info):
        super(Resource, self).__init__()
        self.databaseItemResource = DatabaseItemResource(info['apiRoot'])

        self.versioning = Versioning()

        # Load up the external foreign code snippets
        codePath = subprocess.check_output(['girder-install', 'plugin-path']).strip()
        codePath = os.path.join(codePath, 'resonant-laboratory/server/foreignCode')

        self.foreignCode = {}

        for filename in os.listdir(codePath):
            infile = open(os.path.join(codePath, filename), 'rb')
            self.foreignCode[filename] = infile.read()
            infile.close()

    @access.public
    @loadmodel(model='item', level=AccessType.WRITE)
    @describeRoute(
        Description('Set or modify item dataset information')
        .param('id', 'The ID of the item.', paramType='path')
        .param('fileId',
               'The id of the file that contains the data for ' +
               'this dataset (e.g. may be in a different item). If not supplied, ' +
               'the default behavior is to 1) use any database link information ' +
               'stored in the item, or 2) use the first file discovered inside the item',
               required=False)
        .param('format',
               'The format of the file. Must be one of "csv", "json", ' +
               'or "mongodb.collection". If not supplied, the default behavior ' +
               'is to infer the format from the file extension or (TODO:) MIME type',
               required=False)
        .param('jsonPath',
               'If the format of the file is "json", this parameter is a JSONPath ' +
               'expression that indicates where in the JSON file the list of dataset ' +
               'items be found. By default, this is "$", or the root of the json file ' +
               '(assumes that the root is a list, not a dictionary).',
               required=False)
        .param('dialect',
               'If the format of the file is "csv", this parameter specifies how the ' +
               'CSV file should be parsed. This should be a JSON dictionary, containing ' +
               'parameters to a python CSV reader object. Default behavior is to use ' +
               'csv.Sniffer() to auto-detect delimiters, etc.',
               required=False)
        .errorResponse()
    )
    def setupDataset(self, item, params):
        metadata = item.get('meta', {})
        rlab = metadata.get('rlab', {})
        rlab['itemType'] = 'dataset'
        rlab['versionNumber'] = self.versioning.versionNumber({})

        # Determine fileId
        if 'fileId' in params:
            # We were given the fileId
            rlab['fileId'] = params['fileId']
        else:
            if 'databaseMetadata' in item:
                # This is a database; there is no fileId
                rlab['format'] = 'mongodb.collection'
            else:
                # Use the first file in this item
                childFiles = [f for f in self.model('item').childFiles(item=item)]
                if (len(childFiles) == 0):
                    raise RestException('Item contains no files')
                rlab['fileId'] = childFiles[0]['_id']

        # Determine format
        fileObj = None
        if 'fileId' in rlab:
            fileObj = self.model('file').load(rlab['fileId'], user=self.getCurrentUser())
            exts = fileObj.get('exts', [])
            mimeType = fileObj.get('mimeType', '').lower()
            if 'json' in exts or 'json' in mimeType:
                rlab['format'] = 'json'
            elif 'csv' in exts or 'tsv' in exts or 'csv' in mimeType or 'tsv' in mimeType:
                rlab['format'] = 'csv'
            else:
                raise RestException('Could not determine file format')

        # Format details
        if rlab['format'] == 'json':
            if 'jsonPath' in params:
                rlab['jsonPath'] = params['jsonPath']
            else:
                rlab['jsonPath'] = '$'
        elif rlab['format'] == 'csv':
            if 'dialect' in params:
                rlab['dialect'] = json.loads(params['dialect'])
            else:
                # use girder_worker's enhancements of csv.Sniffer()
                # to infer the dialect (use at most 64K of data)
                sample = functools.partial(self.model('file').download, fileObj, headers=False, endByte=65536)()
                reader = get_csv_reader(sample)
                dialect = reader.dialect
                # Check if it's a standard dialect (we have to do this
                # to get at details like the delimiter if it IS standard...
                # otherwise, they're directly accessible)
                try:
                    dialect = csv.get_dialect(dialect)
                except Exception:
                    pass

                # Okay, now dump all the parameters so that
                # we can reconstruct the dialect later
                rlab['dialect'] = {}
                for key, value in inspect.getmembers(dialect):
                    if key[0] == '_':
                        continue
                    rlab['dialect'][key] = value

        metadata['rlab'] = rlab
        item['meta'] = metadata
        self.model('item').updateItem(item)

        return rlab

    @access.public
    @loadmodel(model='item', level=AccessType.READ)
    @describeRoute(
        Description('Infer the schema of a dataset.')
        .notes('Calculates the potential frequency of various data types ' +
               'for each attribute in the dataset (i.e. how many values ' +
               'can be successfully coerced into a string, number, etc.). ' +
               'Also notes the min and max value where appropriate, as well ' +
               'as whether or not a given type was the native format of any value ' +
               'for that attribute.')
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
        Description('Get a histogram for a data attribute')
        .param('id', 'The ID of the dataset item.', paramType='path')
        .param('filterQuery',
               'Get the histogram after the results of these filters. ' +
               'TODO: describe the ' +
               'filter format used in the girder_db_items plugin.',
               required=False)
        .param('attrName',
               'The name of the attribute to count',
               required=False)
        .param('coerce',
               'Attempt to coerce all values to "boolean","int",' +
               '"number","date", or "string". Incompatible or missing ' +
               'values will be assigned to appropriate bins such as "NaN" ' +
               'or "undefined". If no coercion value is supplied, ',
               required=False)
        .param('type',
               'Coerce values to ',
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
    def getData(self, item, params):
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
        collection = self.getMongoCollection(item)
        mr_result = collection.inline_map_reduce(self.foreignCode['schema_map.js'],
                                                 self.foreignCode['schema_reduce.js'])
        # rearrange into a neater dict before sending it back
        result = {}
        for r in mr_result:
            result[r['_id']] = r['value']
        return result

    def getMongoHistograms(self, item, params):
        """
        Debugging parameters for NCI dataset:
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
                # Make sure this attribute is actually a number
                # (TODO: what about other quantitative values, like dates?)
                pipeline.append({
                    '$match': {
                        attr: {'$type': 'number'}
                    }
                })
                histogramRange = spec['max'] - spec['min']
                if histogramRange == 0:
                    raise RestException('Min and max are the same for ' + attr +
                                        '; should this be a categorical attribute?')
                # Our bins are left-closed, right-open, with the
                # exception of the last value (the final bin is closed
                # on the right). To make the math with the last bin simpler,
                # we just create one extra bin and add the final bin's
                # count to the previous one
                divisions = spec['binCount']
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
                                    divisions
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
                temp = list(collection.aggregate(pipeline))
                # quick lookup for which bins already exist
                createdBins = dict(zip([b['_id'] for b in temp], temp))

                # create every potential bin in the normal range
                results[attr] = []
                for binNo in range(divisions):
                    newBin = {
                        '_id': binNo,
                        'lowBound': (float(binNo) / divisions) * histogramRange + spec['min'],
                        'highBound': (float(binNo + 1) / divisions) * histogramRange + spec['min'],
                        'count': 0
                    }
                    if binNo in createdBins:
                        newBin['count'] += createdBins[binNo]['count']
                    results[attr].append(newBin)
                # the final bin's count will correspond to values that
                # exactly match the highBound of the previous bin...
                # so add that value to the previous bin
                if divisions in createdBins:
                    results[attr][-1]['count'] += createdBins[divisions]['count']
        return results
