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
import bson.json_util
import md5
import math
import itertools
from pymongo import MongoClient
from anonymousAccess import loadAnonymousItem
from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource, RestException, loadmodel
from girder.constants import AccessType
from girder.plugins.girder_db_items.rest import DatabaseItemResource
from girder.plugins.girder_db_items.dbs.mongo import MongoConnector
from girder_worker.format import get_csv_reader


TRUE_VALUES = set([True, 'true', 1, 'True'])


def getSignificantDigit(value, nDigits, roundDown=True):
    # "round" a number to its nearest significant digit
    # As we're looking for low/high boundaries, we control the
    # rounding direction
    if math.isinf(value) or math.isnan(value):
        return value
    if value == 0.0:
        return int(value)

    base = 10**(int(math.floor(math.log10(abs(value)))) - (nDigits - 1))
    if roundDown:
        result = math.floor(value / base) * base
    else:
        result = math.ceil(value / base) * base

    # convert to int if necessary
    if result == math.floor(result):
        result = int(result)
    return result


class DatasetItem(Resource):
    def __init__(self, app):
        super(Resource, self).__init__()
        self.app = app

        self.databaseItemResource = DatabaseItemResource(self.app.info['apiRoot'])

        # Load up the external foreign code snippets
        codePath = subprocess.check_output(['girder-install', 'plugin-path']).strip()
        codePath = os.path.join(codePath, 'resonant-laboratory/server/foreignCode')

        self.foreignCode = {}

        for filename in os.listdir(codePath):
            infile = open(os.path.join(codePath, filename), 'rb')
            self.foreignCode[filename] = infile.read()
            infile.close()

        # For each of our mapreduce operations on flat files, we can reasonably
        # xpect three buffers to be in use at once:
        # one for the file's raw data, one for the list of parsed objects,
        # and one to hold the reduced results. For now, this is small for
        # testing purposes
        self.bufferSize = 131072   # 128K

        self.sniffSampleSize = 131072    # 128K

    def getMongoCollection(self, item):
        dbMetadata = item['databaseMetadata']
        conn = MongoClient(dbMetadata['url'])
        return conn[dbMetadata['database']][dbMetadata['collection']]

    def mongoMapReduce(self, item, mapScript, reduceScript, filters={}, fields={}):
        collection = self.getMongoCollection(item)
        # TODO: convert the filters argument to a mongo-style query, and
        # pass it in as the query parameter
        mr_result = collection.inline_map_reduce(mapScript, reduceScript)
        # rearrange into a neater dict before sending it back
        result = {}
        for r in mr_result:
            # TODO: remove fields not specified in the fields parameter
            # (or is there a more efficient way to keep them out of
            # the results in the first place?)
            result[r['_id']] = r['value']
        return result

    def bufferedDownloadLineReader(self, fileId, user, lineterminator="\r\n", filters={}, fields={}):
        # TODO: @ronichoudhury is implementing something cool
        # that will make this function obsolete
        lineterminator = re.compile('[' + lineterminator + ']')
        fileObj = self.model('file').load(fileId, user=user)
        # TODO: This is my ignorance of Girder... how exactly do we
        # call download directly?
        # TODO: only grab a few lines at a time instead of
        # dumping the whole thing at once
        # TODO: apply the filters and fields parameters to
        # limit how much data we actually pull out
        chunk = functools.partial(self.model('file').download,
                                  fileObj,
                                  headers=False,
                                  endByte=None)()
        chunk = str(chunk().next())
        chunk = lineterminator.split(chunk)
        for line in chunk:
            yield line

    def bufferedDownloadItemReader(self, fileId, user, jsonPath='$', filters={}, fields={}):
        # TODO: @ronichoudhury is implementing something cool
        # that will make this function obsolete
        fileObj = self.model('file').load(fileId, user=user)
        # TODO: This is my ignorance of Girder... how exactly do we
        # call download directly?
        # TODO: only grab a few lines at a time instead of
        # dumping the whole thing at once
        # TODO: apply the filters and fields parameters to
        # limit how much data we actually pull out
        chunk = functools.partial(self.model('file').download,
                                  fileObj,
                                  headers=False,
                                  endByte=None)()
        chunk = str(chunk().next())
        # TODO: Use the jsonPath argument to
        # point to the appropriate part of the file
        chunk = bson.json_util.loads(chunk)
        for line in chunk:
            yield line

    def getStringifiedDialect(self, item):
        dialect = item['meta']['rlab']['dialect']
        for key, value in dialect.iteritems():
            if type(value) is unicode:
                dialect[key] = str(value)
        return dialect

    def flatFileMapReduce(self, item, user, mapScript, reduceScript):
        # TODO: This is an incredibly naive, single-threaded implementation.
        # It shouldn't be hard to rewrite this to use multiple threads...
        # (though, to be fair, the user shouldn't be using big flat files
        # in the first place)
        mapReduceCode = execjs.compile(mapScript + reduceScript +
                                       self.foreignCode['mapReduceChunk.js'])
        fileFormat = item['meta']['rlab']['format']
        reader = None
        if fileFormat == 'csv':
            dialect = self.getStringifiedDialect(item)
            csv.register_dialect(item['name'], **dialect)
            lineReader = self.bufferedDownloadLineReader(item['meta']['rlab']['fileId'], user,
                                                         dialect['lineterminator'])
            reader = csv.DictReader(lineReader, dialect=item['name'])
        elif fileFormat == 'json':
            reader = self.bufferedDownloadItemReader(item['meta']['rlab']['fileId'], user, '$')
        else:
            raise RestException('Unrecognized file type: ' + fileFormat)

        rawData = []
        reducedResult = {}

        for line in reader:
            rawData.append(line)
            if sys.getsizeof(rawData) >= self.bufferSize:
                reducedResult = mapReduceCode.call('mapReduceChunk', rawData, reducedResult)
                rawData = []
        # last chunk
        return mapReduceCode.call('mapReduceChunk', rawData, reducedResult)

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
            fileObj = self.model('file').load(rlab['fileId'], user=user)
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
                rlab['dialect'] = bson.json_util.loads(params['dialect'])
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
        if 'meta' not in item or 'rlab' not in item['meta']:
            item = self.setupDataset(id=item['_id'], params={}, user=user)

        # Run the schema MapReduce code
        mapScript = self.foreignCode['schema_map.js']
        reduceScript = self.foreignCode['schema_reduce.js']

        if 'databaseMetadata' in item:
            if item['databaseMetadata']['type'] == 'mongo':
                schema = self.mongoMapReduce(item, mapScript, reduceScript)
            else:
                raise RestException('MapReduce for ' +
                                    item['databaseMetadata']['type'] +
                                    ' databases is not yet supported')
        else:
            schema = self.flatFileMapReduce(item, user, mapScript, reduceScript)

        # We want to preserve any explicit user coerceToType or interpretation settings
        # thay may have existed in the previous schema
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

        return self.model('item').updateItem(item)

    @access.public
    @loadAnonymousItem()
    @describeRoute(
        Description('Get a histogram for all data attributes')
        .param('id', 'The ID of the dataset item.', paramType='path')
        .param('filter',
               'Get the histogram after the results of this filter. ' +
               'TODO: describe our filter grammar.',
               required=False)
        .param('limit', 'Result set size limit (default=50).',
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
               'or "undefined". If no coercion value is supplied, values ' +
               'will be binned into type categories ("interpretation" will be ' +
               'ignored).'
               '<br/><br/>interpretation<br/>' +
               'If "ordinal", values will be summarized in order---either number range ' +
               'bins (e.g. 0-10, 11-20, ...), or lexicographic bins (e.g. A-D, E-H, ...). ' +
               'If "categorical" (default), values will be treated as unordered, categorical data.' +
               '<br/><br/>lowBound<br/>' +
               'Defines the low bound of the histogram if interpretation=ordinal. Default is ' +
               'to use the minimum value in the dataset.'
               '<br/><br/>highBound<br/>' +
               'Defines the high bound of the histogram if interpretation=ordinal. Default is ' +
               'to use the maximum value in the dataset.'
               '<br/><br/>specialBins<br/>' +
               'An array of values that will be put into their own bins, regardless of ' +
               'all other settings. This lets you separate bad values/error codes, e.g. ' +
               '[-9999,"N/A"]. These special values will be added to the set of natively ' +
               'recognized special bins: [undefined, null, NaN, Infinity, -Infinity, "", "other"]'
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
                        'if the same query has been run previously. Also, store the results ' +
                        'of this query in the metadata cache.',
               required=False, dataType='boolean')
        .errorResponse()
    )
    def getHistograms(self, item, params, user):
        if 'meta' not in item or 'rlab' not in item['meta']:
            item = self.setupDataset(id=item['_id'], params={}, user=user)
        if 'schema' not in item['meta']['rlab']:
            item = self.inferSchema(id=item['_id'], params={}, user=user)

        # Populate params with default settings
        # where settings haven't been specified
        params['filter'] = bson.json_util.loads(params.get('filter', 'true'))
        params['limit'] = params.get('limit', 50)
        params['offset'] = params.get('offset', 0)

        binSettings = bson.json_util.loads(params.get('binSettings', '{}'))
        for attrName, attrSchema in item['meta']['rlab']['schema'].iteritems():
            binSettings[attrName] = binSettings.get(attrName, {})

            coerceToType = attrSchema.get('coerceToType', None)
            coerceToType = binSettings[attrName].get('coerceToType', coerceToType)
            binSettings[attrName]['coerceToType'] = coerceToType

            if binSettings[attrName]['coerceToType'] is None:
                interpretation = binSettings[attrName]['interpretation'] = 'categorical'
            else:
                interpretation = attrSchema.get('interpretation', 'categorical')
                interpretation = binSettings[attrName].get('interpretation', interpretation)
                binSettings[attrName]['interpretation'] = interpretation

            specialBins = bson.json_util.loads(binSettings[attrName].get('specialBins', '[]'))
            binSettings[attrName]['specialBins'] = specialBins

            numBins = binSettings[attrName].get('numBins', 10)
            binSettings[attrName]['numBins'] = numBins

            if interpretation == 'ordinal':
                lowBound = attrSchema[coerceToType]['lowBound']
                lowBound = binSettings[attrName].get('lowBound', lowBound)

                highBound = attrSchema[coerceToType]['highBound']
                highBound = binSettings[attrName].get('highBound', highBound)

                # Pre-populate the bins with human-readable names
                if coerceToType == 'integer' or coerceToType == 'number':
                    lowBound = getSignificantDigit(lowBound, 2, roundDown=True)
                    highBound = getSignificantDigit(highBound, 2, roundDown=False)

                    binSettings[attrName]['humanBins'] = []
                    binSettings[attrName]['binBounds'] = []
                    for binNo in xrange(numBins):
                        l = lowBound + (highBound - lowBound) * float(binNo) / numBins
                        h = lowBound + (highBound - lowBound) * float(binNo + 1) / numBins
                        if (binNo < numBins - 1):
                            # Most bins do not include the upper bound
                            # (and the upper bound is rounded down so that it's
                            # the same as the next bin's lower bound)
                            label = '[' + str(getSignificantDigit(l, 2, roundDown=True)) + \
                                ', ' + str(getSignificantDigit(h, 2, roundDown=True)) + ')'
                        else:
                            # The last bin includes the upper bound, and it's rounded up
                            label = '[' + str(getSignificantDigit(l, 2, roundDown=True)) + \
                                ', ' + str(getSignificantDigit(h, 2, roundDown=False)) + ']'
                        binSettings[attrName]['humanBins'].append(label)
                        binSettings[attrName]['binBounds'].append((l, h))

                elif coerceToType == 'string':
                    # TODO: ordinal binning of strings (lexographic)
                    binSettings[attrName]['humanBins'] = []
                    binSettings[attrName]['binBounds'] = []
                elif coerceToType == 'date':
                    # TODO: ordinal binning of dates
                    binSettings[attrName]['humanBins'] = []
                    binSettings[attrName]['binBounds'] = []
                else:
                    raise RestException('Can not treat attribute ' + attrName +
                                        ' of type ' + coerceToType + ' as ordinal data.')

                binSettings[attrName]['lowBound'] = lowBound
                binSettings[attrName]['highBound'] = highBound
            else:
                # TODO: if there are cached categorical bins (from a first,
                # pass with uncertainty in the results), populate this list with those
                # known categorical values for the second pass
                binSettings[attrName]['humanBins'] = []

        params['binSettings'] = binSettings
        params['cache'] = params.get('cache', False) in TRUE_VALUES

        # Stringify the params, both for cache hashing, as well as stitching
        # together the map and reduce code below
        paramsCode = bson.json_util.dumps(params,
                                          sort_keys=True,
                                          indent=2,
                                          separators=(',', ': '))

        # Check if this query has already been run - if so, return the cached result
        if params['cache']:
            paramsMD5 = md5.md5(paramsCode).hexdigest()
            if 'histogramCaches' in item['meta']['rlab'] and paramsMD5 in item['meta']['rlab']['histogramCaches']:
                return item['meta']['rlab']['histogramCaches'][paramsMD5]

        # Construct and run the histogram MapReduce code
        mapScript = 'function map () {\n' + \
            'var params = ' + paramsCode + ';\n' + \
            self.foreignCode['histogram_map.js'] + '\n}'

        reduceScript = 'function reduce (attrName, allHistograms) {\n' + \
            'var params = ' + paramsCode + ';\n' + \
            self.foreignCode['histogram_reduce.js'] + '\n' + \
            'return {histogram: histogram};\n}'

        if 'databaseMetadata' in item:
            if item['databaseMetadata']['type'] == 'mongo':
                # TODO: instead of filtering inside the mapReduce code,
                # convert params['filter'] to a mongo query and do this:
                # histogram = self.mongoMapReduce(item, mapScript, reduceScript, query=query)
                histogram = self.mongoMapReduce(item, mapScript, reduceScript)
            else:
                raise RestException('MapReduce for ' +
                                    item['databaseMetadata']['type'] +
                                    ' databases is not yet supported')
        else:
            histogram = self.flatFileMapReduce(item, user, mapScript, reduceScript)

        # We have to clean up the histogram wrappers (mongodb can't return
        # an array from reduce functions). While we're at it, add the
        # lowBound / highBound details to each ordinal bin
        for attrName, wrappedHistogram in histogram.iteritems():
            histogram[attrName] = wrappedHistogram['histogram']
            if attrName in binSettings and 'binBounds' in binSettings[attrName]:
                for binIndex, bounds in enumerate(binSettings[attrName]['binBounds']):
                    histogram[attrName][binIndex]['lowBound'] = bounds[0]
                    histogram[attrName][binIndex]['highBound'] = bounds[1]

        # Cache the results before returning them
        if params['cache']:
            if 'histogramCaches' not in item['meta']['rlab']:
                item['meta']['rlab']['histogramCaches'] = {}
            item['meta']['rlab']['histogramCaches'][paramsMD5] = histogram
            self.model('item').updateItem(item)
        return histogram

    @access.public
    @loadmodel(model='item', level=AccessType.READ)
    @describeRoute(
        Description('Filter the data in the item. Returns data formatted as a JSON list of dicts')
        .param('id', 'The ID of the item.', paramType='path')
        .param('limit', 'Result set size limit (default=50).',
               required=False, dataType='int')
        .param('offset', 'Offset into result set (default=0).',
               required=False, dataType='int')
        .param('fields', 'A comma-separated or JSON list of fields (column '
               'names) to return (default is all fields).  If a JSON list is '
               'used, instead of a plain string, a field may be a dictionary '
               'with a function definition and an optional "reference" entry '
               'which is used to identify the resultant column.',
               required=False)
        .param('filter', 'Get the pages of data after the results of this filter. ' +
               'TODO: describe our filter grammar.', required=False)
        .errorResponse()
    )
    def getData(self, item, params):
        # TODO: For now I just dump all the unfiltered results
        # (need to implement the filtering for flat files AND
        # convert for the database)
        if 'filter' in params:
            del params['filter']

        # TODO: I also ignore the fields parameter for now
        if 'fields' in params:
            del params['fields']

        params['limit'] = int(params.get('limit', 50))
        params['offset'] = int(params.get('offset', 0))

        if 'databaseMetadata' in item:
            params['format'] = 'dict'

            selectResult = self.databaseItemResource.databaseSelect(id=item['_id'], params=params)
            return bson.json_util.loads(list(selectResult())[0])['data']
        else:
            fileFormat = item['meta']['rlab']['format']
            if fileFormat == 'csv':
                dialect = self.getStringifiedDialect(item)
                csv.register_dialect(item['name'], **dialect)
                lineReader = self.bufferedDownloadLineReader(item['meta']['rlab']['fileId'],
                                                             self.getCurrentUser(),
                                                             dialect['lineterminator'])
                reader = csv.DictReader(lineReader, dialect=item['name'])
            elif fileFormat == 'json':
                reader = self.bufferedDownloadItemReader(item['meta']['rlab']['fileId'],
                                                         self.getCurrentUser(),
                                                         '$')
            else:
                raise RestException('Unrecognized file type: ' + fileFormat)

            # Just slice a page... obviously we'll do something fancier in the future
            resultReader = itertools.islice(reader, params['offset'], params['offset'] + params['limit'])
            return [line for line in resultReader]
