import sys
import os
import subprocess
import execjs
import functools
import datetime
import copy
import inspect
import re
import csv
import json
import md5
import math
import itertools
import cherrypy
from pymongo import MongoClient
from anonymousAccess import loadAnonymousItem
from querylang import astToMongo
from pluginDir import pluginDir
from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource, RestException, loadmodel
from girder.constants import AccessType
from girder.plugins.database_assetstore.dbs.mongo import MongoConnector
from girder_worker.format import get_csv_reader
from girder.plugins.database_assetstore.assetstore import getDbInfoForFile


TRUE_VALUES = set([True, 'true', 1, 'True'])

class DatasetItem(Resource):
    def __init__(self, app):
        super(Resource, self).__init__()
        self.app = app

        # Load up the external foreign code snippets
        codePath = os.path.join(pluginDir(), 'general_purpose')

        self.foreignCode = {}

        for filename in os.listdir(codePath):
            extension = os.path.splitext(filename)[1]
            if extension != '.js' and extension != '.json':
                continue
            infile = open(os.path.join(codePath, filename), 'rb')
            self.foreignCode[filename] = infile.read()
            infile.close()

        self.sniffSampleSize = 131072    # 128K

    def getMongoCollection(self, dbInfo):
        url = dbInfo['url']
        url = url[:url.rfind('/')]  # strip off the assetstore db name
        connection = MongoClient(url)
        return connection[dbInfo['database']][dbInfo['table']]

    def mongoMapReduce(self, mapScript, reduceScript, collection, params):
        # Convert our AST filter expression to a mongo filter
        query = None
        if 'filter' in params and params['filter'] is not None:
            query = astToMongo(params['filter'])
        mr_result = collection.inline_map_reduce(mapScript,
                                                 reduceScript,
                                                 query=query,
                                                 scope={
                                                     'counter': -1,
                                                     'params': params
                                                 })
        # rearrange into a neater dict before sending it back
        result = {}
        for r in mr_result:
            # TODO: remove fields not specified in the fields parameter
            # (or is there a more efficient way to keep them out of
            # the results in the first place?)
            result[r['_id']] = r['value']
        return result

    def mapReduceViaDownload(self, item, user, mapScript, reduceScript, params):
        # TODO: This is an incredibly naive, single-threaded implementation.
        # Potential optimizations:

        # 1. One major bottleneck is shuffling text to and from the javascript
        # engine via PyExecJS. For testing purposes, bufferSize is small;
        # larger values might be more performant, depending on how much
        # memory you want to use.
        bufferSize = 131072   # 128K

        # 2. Of course, you could bypass this problem entirely if you rewrite
        # the MapReduce code in Python (then you'll have the problem of
        # duplicate code).

        # 3. To be fair, if the data is large enough to matter, the user should
        # be using one of our supported databases instead (i.e. a database
        # that can run our schema inference / histogram mapReduce code directly).
        # Probably the best option of the three would be to avoid calling
        # this function in the first place

        extraParameters = {
            'fileType': item['meta']['rlab']['format'],
            'outputType': 'jsonlines'
        }
        if 'filter' in params and params['filter'] is not None:
            extraParameters['filter'] = params['filter']
        extraParameters = json.dumps(extraParameters)

        fileObj = self.model('file').load(item['meta']['rlab']['fileId'],
                                          level=AccessType.READ,
                                          user=user,
                                          exc=True)
        stream = self.model('file').download(fileObj, headers=False, extraParameters=extraParameters)

        # Because we already used the offset and limit params in the download endpoint,
        # the mapReduce code should run on the full result
        params['offset'] = 0
        params['limit'] = 0

        # Stitch together the code for running via PyExecJS
        paramsCode = json.dumps(params, indent=2, separators=(',', ': '))
        mapReduceCode = execjs.compile(mapScript + reduceScript +
                                       'var params = ' + paramsCode + ';\n' +
                                       self.foreignCode['mapReduceChunk.js'])

        rawData = []
        reducedResult = {}

        for line in stream():
            rawData.append(json.loads(line))
            if sys.getsizeof(rawData) >= bufferSize:
                reducedResult = mapReduceCode.call('mapReduceChunk', rawData, reducedResult)
                rawData = []
        # last chunk
        return mapReduceCode.call('mapReduceChunk', rawData, reducedResult)

    def mapReduce(self, item, mapScript, reduceScript, params={}):
        # Get the current or the anonymous user
        user = self.getCurrentUser()
        if user is None:
            user = self.app.anonymousAccess.getAnonymousUser()

        # Figure out what kind of assetstore the file is in
        fileInfo = self.model('file').load(item['meta']['rlab']['fileId'],
                                           level=AccessType.READ,
                                           user=user,
                                           exc=True)
        dbInfo = getDbInfoForFile(fileInfo)

        # Okay, figure out how/where we want to run our mapreduce code
        if dbInfo is not None:
            if dbInfo['type'] == 'mongo':
                collection = self.getMongoCollection(dbInfo)
                result = self.mongoMapReduce(mapScript, reduceScript, collection, params)
            else:
                raise RestException('MapReduce for ' +
                                    dbInfo['type'] +
                                    ' databases is not yet supported')
        else:
            result = self.mapReduceViaDownload(item, user, mapScript, reduceScript, params)

        return result

    @access.public
    @loadAnonymousItem()
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
               'is to infer the format from the file extension or MIME type',
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
    def setupDataset(self, item, params, user):
        metadata = item.get('meta', {})
        rlab = metadata.get('rlab', {})
        rlab['itemType'] = 'dataset'
        rlab['versionNumber'] = self.app.versioning.versionNumber({})

        # Determine fileId
        if 'fileId' in params:
            # We were given the fileId
            rlab['fileId'] = params['fileId']
        else:
            # Use the first file in this item
            childFiles = [f for f in self.model('item').childFiles(item=item)]
            if (len(childFiles) == 0):
                raise RestException('Item contains no files')
            rlab['fileId'] = childFiles[0]['_id']

        # Determine format
        fileObj = None
        if 'fileId' in rlab:
            fileObj = self.model('file').load(rlab['fileId'], user=user)
            if getDbInfoForFile(fileObj) is not None:
                # All database info is returned internally as CSV.
                # TODO: this will change soon!
                rlab['format'] = 'csv'
                params['dialect'] = '{}'    # use default parsing settings
            else:
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
                # to infer the dialect
                sample = functools.partial(self.model('file').download,
                                           fileObj,
                                           headers=False,
                                           endByte=self.sniffSampleSize)()
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

        # Calling setupDataset invalidates the schema and any cached histograms
        if 'schema' in item['meta']['rlab']:
            del item['meta']['rlab']['schema']
        if 'lastUpdated' in item['meta']['rlab']:
            del item['meta']['rlab']['lastUpdated']
        if 'histogramCaches' in item['meta']['rlab']:
            del item['meta']['rlab']['histogramCaches']

        return self.model('item').updateItem(item)

    @access.public
    @loadAnonymousItem()
    @describeRoute(
        Description('Infer the schema of a dataset.')
        .notes('Calculates the potential frequency of various data types ' +
               'for each attribute in the dataset (i.e. how many values ' +
               'can be successfully coerced into a string, number, etc.). ' +
               'Also notes the min and max value where appropriate, as well ' +
               'as whether or not a given type was the native format of any value ' +
               'for that attribute.')
        .param('id', 'The ID of the item.', paramType='path')
        .errorResponse()
    )
    def inferSchema(self, item, params, user):
        # Do we have the necessary basic metadata?
        invalid = 'meta' not in item or 'rlab' not in item['meta']
        if not invalid:
            # Do we have a file format specified?
            invalid = 'format' not in item['meta']['rlab']
        if not invalid and 'fileId' in item['meta']['rlab']:
            # Do we specify a file that we don't have (this happens
            # when making anonymous copies of datasets)?
            invalid = True
            for f in self.model('item').childFiles(item=item):
                if f['_id'] == item['meta']['rlab']['fileId']:
                    invalid = False
                    break
        if invalid:
            # We need to update the basic dataset details
            temp = self.setupDataset(id=item['_id'], params={}, user=user)
            # We need to reload the item with the new changes
            temp = temp.get('__copiedItemId__', temp['_id'])
            item = self.model('item').load(temp,
                                           level=AccessType.WRITE,
                                           user=user,
                                           exc=True)

        # Run the schema MapReduce code
        mapScript = 'function map () {\n' + \
            self.foreignCode['binUtils.js'] + '\n' + \
            self.foreignCode['schema_map.js'] + '\n}'
        reduceScript = 'function reduce(key, values) {\n' + \
            self.foreignCode['schema_reduce.js'] + '\n' + \
            'return counters;\n}'

        schema = self.mapReduce(item, mapScript, reduceScript)

        # We want to preserve any explicit user coerceToType or interpretation settings
        # thay may have existed in the previous schema (if they exist, they were
        # explicitly set by the user)
        existingSchema = item['meta']['rlab'].get('schema', {})
        for attrName in schema.iterkeys():
            if attrName in existingSchema:
                if 'coerceToType' in existingSchema[attrName]:
                    schema[attrName]['coerceToType'] = existingSchema[attrName]['coerceToType']
                if 'interpretation' in existingSchema[attrName]:
                    schema[attrName]['interpretation'] = existingSchema[attrName]['interpretation']

        item['meta']['rlab']['schema'] = schema
        item['meta']['rlab']['lastUpdated'] = datetime.datetime.now().isoformat()

        # A fresh schema inference invalidates any cached histograms
        if 'histogramCaches' in item['meta']['rlab']:
            del item['meta']['rlab']['histogramCaches']

        self.model('item').updateItem(item)

        return schema

    def fillInDefaultHistogramParams(self, item, params):
        # Populate params with default settings
        # where settings haven't been specified
        params['filter'] = params.get('filter', None)
        if params['filter'] is not None:
            params['filter'] = json.loads(params['filter'])
        params['limit'] = params.get('limit', None)
        if params['limit'] == 0:
            params['limit'] = None
        params['offset'] = params.get('offset', 0)

        binSettings = json.loads(params.get('binSettings', '{}'))
        for attrName, attrSchema in item['meta']['rlab']['schema'].iteritems():
            binSettings[attrName] = binSettings.get(attrName, {})

            # Get user-defined or default type coercion setting
            coerceToType = attrSchema.get('coerceToType', 'object')
            coerceToType = binSettings[attrName].get('coerceToType', coerceToType)
            binSettings[attrName]['coerceToType'] = coerceToType

            # Get user-defined or default interpretation setting
            if binSettings[attrName]['coerceToType'] is 'object':
                interpretation = binSettings[attrName]['interpretation'] = 'categorical'
            else:
                interpretation = attrSchema.get('interpretation', 'categorical')
                interpretation = binSettings[attrName].get('interpretation', interpretation)
                binSettings[attrName]['interpretation'] = interpretation

            # Get any user-defined special bins (the defaults are
            # listed in histogram_reduce.js)
            specialBins = json.loads(binSettings[attrName].get('specialBins', '[]'))
            binSettings[attrName]['specialBins'] = specialBins

            # Get user-defined or default number of bins
            numBins = binSettings[attrName].get('numBins', 10)
            binSettings[attrName]['numBins'] = numBins

            # For ordinal binning, we need some more details:
            if interpretation == 'ordinal':
                if coerceToType == 'string' or coerceToType == 'object':
                    # Use the locale to construct the bins
                    lowBound = None
                    highBound = None
                    locale = binSettings[attrName].get('locale', None)
                    if locale is None:
                        # Default is to try to extract locale information
                        # from the Accept-Language header, with 'en' as
                        # a backup (TODO: do smarter things with alternative
                        # locales)
                        locale = cherrypy.request.headers.get('Accept-Language', 'en')
                        if ',' in locale:
                            locale = locale.split(',')[0].strip()
                        if ';' in locale:
                            locale = locale.split(';')[0].strip()
                else:
                    # Use default or user-defined low/high boundary values
                    # to construct the bins
                    locale = None
                    lowBound = attrSchema[coerceToType]['lowBound']
                    highBound = attrSchema[coerceToType]['highBound']
                    lowBound = binSettings[attrName].get('lowBound', lowBound)
                    highBound = binSettings[attrName].get('highBound', highBound)
                    if lowBound is None or highBound is None:
                        raise RestException('There are no observed values of ' +
                                            'type ' + coerceToType + ', so it is ' +
                                            'impossible to automatically determine ' +
                                            'low/high bounds for an ordinal interpretation.' +
                                            ' Please supply bounds or change to "categorical".')
                    binSettings[attrName]['lowBound'] = lowBound
                    binSettings[attrName]['highBound'] = highBound

                # Pre-populate the bins with human-readable names
                binUtilsCode = execjs.compile('var LOCALE_INDEXES = ' +
                                              self.foreignCode['localeIndexes.json'] + ';\n' +
                                              self.foreignCode['binUtils.js'])
                binSettings[attrName]['ordinalBins'] = binUtilsCode.call('createBins',
                                                                         coerceToType,
                                                                         numBins,
                                                                         lowBound,
                                                                         highBound,
                                                                         locale)['bins']
            else:
                pass
                # We can ignore the ordinalBins parameter if we're being
                # categorical. TODO: the fancier 2-pass idea in histogram_reduce.js
                # would necessitate that we do something different here

        params['binSettings'] = binSettings
        params['cache'] = params.get('cache', False) in TRUE_VALUES

        return params, binSettings

    @access.public
    @loadmodel(model='item', level=AccessType.READ)
    @describeRoute(
        Description('Get a histogram for all data attributes')
        .param('id', 'The ID of the dataset item.', paramType='path')
        .param('filter',
               'Get the histogram after the results of this filter. ' +
               'TODO: describe our filter grammar (an AST tree).',
               required=False)
        .param('limit', 'Result set size limit. Setting to 0 will create ' +
               'a histogram using all the matching items (default=0).',
               required=False, dataType='int')
        .param('offset', 'Offset into result set (default=0).',
               required=False, dataType='int')
        .param('binSettings',
               'A JSON dictionary containing settings that control how ' +
               'each attribute is binned. Each key should correspond to an attribute ' +
               'name, and the value should be a dictionary containing zero or more of ' +
               'these settings:' +
               '<br/><br/>coerceToType<br/>' +
               'Attempt to coerce all values to "boolean","int",' +
               '"number","date", or "string". Incompatible or missing ' +
               'values will be assigned to appropriate bins such as "NaN" ' +
               'or "undefined". If "object" (default) is supplied, values ' +
               'will be binned into type categories ("interpretation" will be ' +
               'ignored).'
               '<br/><br/>interpretation<br/>' +
               'If "ordinal", values will be summarized in order---either number range ' +
               'bins (e.g. 0-10, 11-20, ...), or lexicographic bins (e.g. A-D, E-H, ...). ' +
               'If "categorical" (default), values will be treated as unordered, categorical data.' +
               '<br/><br/>lowBound<br/>' +
               'Defines the low bound of the histogram if interpretation=ordinal. Default is ' +
               'to use the minimum value in the dataset.' +
               '<br/><br/>highBound<br/>' +
               'Defines the high bound of the histogram if interpretation=ordinal. Default is ' +
               'to use the maximum value in the dataset.' +
               '<br/><br/>locale<br/>' +
               'Specify the locale for binning ordinal strings. Default behavior is to use the ' +
               'locale specified by the Accept-Language header, followed by "en" if that can not ' +
               'be determined.' +
               '<br/><br/>specialBins<br/>' +
               'An array of values that will be put into their own bins, regardless of ' +
               'all other settings. This lets you separate bad values/error codes, e.g. ' +
               '[-9999,"N/A"]. These special values will be added to the set of natively ' +
               'recognized special bins: [undefined, null, NaN, Infinity, -Infinity, "" (empty string), "Invalid Date", "other"]' +
               '<br/><br/>numBins<br/>' +
               'Defines the maximum number of bins to use, in addition to the specialBins ' +
               '(default: 10 bins). For categorical data, the bins are arbitrarily chosen' +
               '(in the future, the n-most frequent values will be chosen), and an "other" ' +
               'bin will be created for values not in this set. Setting this to 0 will ' +
               'create distinct bins for every value encountered (can be very expensive/useless for ' +
               'attributes with lots of distinct values, such as IDs!). For ordinal data, ' +
               'each bin will span a range of values (defined by lowBound and highBound).',
               required=False)
        .param('cache', 'If true, attempt to retrieve results cached in the item\'s metadata ' +
                        'if the same query has been run previously. Also, attempt to store the results ' +
                        'of this query in the metadata cache (fails silently if the user does not have ' +
                        'write access).',
               required=False, dataType='boolean')
        .errorResponse()
    )
    def getHistograms(self, item, params):
        if 'meta' not in item or 'rlab' not in item['meta'] or 'schema' not in item['meta']['rlab']:
            raise RestException('Item ' + str(item['_id']) + ' has no schema information.')

        params, binSettings = self.fillInDefaultHistogramParams(item, params)

        # Stringify the params for cache hashing
        paramsCode = json.dumps(params, sort_keys=True)

        # Check if this query has already been run - if so, return the cached result
        if params['cache']:
            paramsMD5 = md5.md5(paramsCode).hexdigest()
            if 'histogramCaches' in item['meta']['rlab'] and paramsMD5 in item['meta']['rlab']['histogramCaches']:
                return item['meta']['rlab']['histogramCaches'][paramsMD5]

        # Construct and run the histogram MapReduce code
        mapScript = 'function map () {\n' + \
            self.foreignCode['binUtils.js'] + '\n' + \
            self.foreignCode['histogram_map.js'] + '\n}'

        reduceScript = 'function reduce (attrName, allHistograms) {\n' + \
            self.foreignCode['histogram_reduce.js'] + '\n' + \
            'return {histogram: histogram};\n}'

        histogram = self.mapReduce(item, mapScript, reduceScript, params)

        # We have to clean up the histogram wrappers (mongodb can't return
        # an array from reduce functions).
        for attrName, wrappedHistogram in histogram.iteritems():
            histogram[attrName] = wrappedHistogram['histogram']

        if '__passedFilters__' not in histogram:
            # This will only happen if there's a count of zero;
            # the __passedFilters__ bin will never have been emitted
            histogram['__passedFilters__'] = [{
                'count': 0,
                'label': 'count'
            }]

        # Cache the results before returning them
        if params['cache']:
            if 'histogramCaches' not in item['meta']['rlab']:
                item['meta']['rlab']['histogramCaches'] = {}
            item['meta']['rlab']['histogramCaches'][paramsMD5] = histogram
            try:
                self.model('item').updateItem(item)
            except AccessException:
                # Meh, we couldn't cache the result. Not a big enough deal
                # to throw / display errors, so just fail silently
                pass
        return histogram
