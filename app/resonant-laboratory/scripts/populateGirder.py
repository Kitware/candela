#!/usr/bin/env python
import argparse
import getpass
import girder_client
import os
import json
import sys
import subprocess


def getArguments():
    parser = argparse.ArgumentParser(description='''Populate a girder installation
        with the public library (datasets and projects) for Resonant Laboratory.
        This script will delete the existing Resonant Laboratory Library collection,
        so running it multiple times won't result in duplicate installations, files,
        or databases (any changes to the existing library will be lost)''')
    parser.add_argument('-u', dest='username', default='admin',
                        help='The administrator username (default: "admin")')
    parser.add_argument('-a', dest='apiUrl',
                        default='http://localhost:8080/api/v1',
                        help='The url of the Girder instance\'s API endpoint.')
    parser.add_argument('-t', dest='databaseThreshold', default='131072',
                        help='If a file exceeds this threshold (in bytes), upload it as a ' +
                        'mongo database collection instead of a flat file.')
    parser.add_argument('-n', dest='dbName',
                        default='resonantLaboratoryLibrary',
                        help='The name of the database to use for larger files.')
    parser.add_argument('-d', dest='dbAssetstoreId', default=None,
                        help='The Id of the database assetstore. If not specified,' +
                        'this script will use the first database assetstore that it ' +
                        'discovers.')

    return parser.parse_args()


def printMessage(message):
    longestLine = max([len(line) for line in message.split('\n')])
    print message
    print ''.join(['=' for x in xrange(longestLine)])   # underline
    print


def authenticate(args):
    print 'Enter the password for Girder user "' + args.username + '":'
    password = getpass.getpass()

    gc = girder_client.GirderClient(apiUrl=args.apiUrl)
    try:
        gc.authenticate(args.username, password)
    except girder_client.AuthenticationError:
        print 'Incorrect username/password'
        sys.exit(1)

    printMessage('\nLogged in successfully')

    return gc


def getCurrentAssetstoreId(gc):
    assetstores = gc.sendRestRequest('GET', 'assetstore/', {})
    assetstores = filter(lambda x: x['current'] is True, assetstores)
    if len(assetstores) == 0:
        return None
    else:
        return assetstores[0]['_id'], assetstores[0]['name']


def useAssetstore(gc, assetstoreId, assetstoreName):
    gc.sendRestRequest('PUT',
                       'assetstore/' + assetstoreId,
                       {
                           'current': True,
                           'name': assetstoreName
                       })


def getDBassetstore(gc, specificId):
    # Get the database assetstore Id and hostname+port
    if specificId is None:
        assetstores = gc.sendRestRequest('GET', 'assetstore/', {})
        assetstores = filter(lambda x: x['type'] == 'database', assetstores)

        if len(assetstores) == 0:
            print 'Could not find a database assetstore'
            sys.exit(1)
        assetstore = assetstores[0]
    else:
        assetstore = gc.sendRestRequest('GET', 'assetstore/' + specificId, {})

    if assetstore['database']['dbtype'] != 'mongo':
        print 'For now, only mongo-based database assetstores are supported'
        sys.exit(1)
    assetstoreId = assetstore['_id']
    assetstoreHost = assetstore['database']['uri'].split('/')[2]

    message = 'Using database assetstore ' + assetstoreId
    message += '\nhost: ' + assetstoreHost
    printMessage(message)

    return assetstoreId, assetstoreHost


def getFSassetstore(gc):
    # Get the Filesystem assetstore Id, and make sure it is current
    assetstores = gc.sendRestRequest('GET', 'assetstore/', {})
    assetstores = filter(lambda x: x['current'] is True, assetstores)

    if len(assetstores) == 0 or assetstores[0]['type'] != 0:
        print 'There must be a current Filesystem assetstore to upload flat files'
        sys.exit(1)
    assetstore = assetstores[0]

    assetstoreId = assetstore['_id']

    message = 'Using Filesystem assetstore ' + assetstoreId
    printMessage(message)

    return assetstoreId


def getLibraryCollection(gc):
    # Get or create the Resonant Laboratory Library collection
    message = ''
    collection = gc.sendRestRequest('GET', 'collection',
                                    {'text': 'Resonant Laboratory Library'})

    # Trash the existing Resonant Laboratory Library collection
    if (len(collection) == 0):
        message = 'No "Resonant Laboratory Library" collection to clean.\n'
    else:
        gc.sendRestRequest('DELETE', 'collection/' + collection[0]['_id'])
        message = 'Deleted "Resonant Laboratory Library" collection.\n'
        collection = []

    # Create a new collection
    collection = gc.sendRestRequest('POST', 'collection',
                                    {'name': 'Resonant Laboratory Library',
                                     'description': 'The public library for' +
                                                    ' the Resonant ' +
                                                    'Laboratory Application',
                                     'public': True})
    message += 'Created collection '
    collectionId = collection['_id']

    message += collectionId
    printMessage(message)

    return collectionId


def getDatasets():
    # Crawl the library/Data directory to determine which datasets
    # exist, and how we should upload them
    datasets = {}

    items = os.listdir('./library/Data')
    for item in items:
        if not os.path.isdir('./library/Data/' + item):
            continue
        datasets[item] = {
            'files': {},
            'collections': {},
            'metadata': None
        }

        files = os.listdir('./library/Data/' + item)
        for fileName in files:
            filePath = os.path.join('./library/Data', item, fileName)
            if fileName == 'metadata.json':
                # metadata.json is special; attach it as the item's
                # metadata instead of uploading it as a file
                temp = open(filePath, 'rb')
                contents = temp.read()
                metadata = json.loads(contents)
                temp.close()
                datasets[item]['metadata'] = metadata
            else:
                fileSize = os.stat(filePath).st_size
                if fileSize > int(args.databaseThreshold):
                    datasets[item]['collections'][fileName] = filePath
                elif os.path.splitext(fileName)[1] == '.json':
                    datasets[item]['files'][fileName] = filePath
                else:
                    datasets[item]['files'][fileName] = filePath

    printMessage('Identified %i datasets' % len(datasets))
    return datasets


def createMongoCollections(args, host, datasets, dbId, parentId):
    collectionNames = set()
    # Create/update all the mongo collections at once
    for datasetName, spec in datasets.iteritems():
        for fileName, filePath in spec['collections'].iteritems():
            # TODO: do this with pymongo, not mongo-import
            # ... or be even more general, and inspect / use
            # whatever kind of database is powering the assetstore
            parts = os.path.splitext(fileName)
            collectionName = parts[0]
            i = 1
            while collectionName in collectionNames:
                collectionName = parts[0] + i
                i += 1
            collectionNames.add(collectionName)
            command = ['mongoimport',
                       '--host', host,
                       '--db', args.dbName,
                       '--collection', collectionName,
                       '--drop',
                       '--file', filePath]
            if parts[1].lower() == '.csv':
                command.extend(['--type', 'csv',
                                '--headerline'])
            else:
                command.append('--jsonArray')
            print subprocess.check_output(command, stderr=subprocess.STDOUT)
    # Hit the /database_assetstore/{id}/import endpoint to load all these
    # collections as files in girder
    collectionNames = [{'database': args.dbName, 'name': n, 'table': n} for n in collectionNames]
    parameters = {
        'parentId': parentId,
        'table': json.dumps(collectionNames),
        'parentType': 'collection'
    }
    gc.sendRestRequest('PUT', 'database_assetstore/' + dbId + '/import', parameters)

    # This will create a folder named args.dbName inside the
    # Resonant Laboratory library collection; we want to rename that
    # folder to "Data"
    parameters = {
        'parentType': 'collection',
        'parentId': parentId,
        'name': args.dbName
    }
    dataFolder = gc.sendRestRequest('GET', 'folder', parameters)
    gc.sendRestRequest('PUT', 'folder/' + dataFolder[0]['_id'], {'name': 'Data'})

    # Now we want to get the Ids of all the items that we just created
    itemList = gc.sendRestRequest('GET', 'item', {'folderId': dataFolder[0]['_id']})

    # Create a lookup table to find Ids by name
    lookupTable = dict(zip([x['name'] for x in itemList],
                           [x['_id'] for x in itemList]))

    printMessage('Uploaded %i datasets as mongodb collections' % len(collectionNames))

    return dataFolder[0]['_id'], lookupTable


def uploadFlatFiles(dataFolderId, datasets):
    fileCount = 0
    lookupTable = {}
    for datasetName, spec in datasets.iteritems():
        itemSpec = gc.load_or_create_item(datasetName, dataFolderId)
        lookupTable[datasetName] = itemSpec['_id']
        for fileName, filePath in spec['files'].iteritems():
            print 'Uploading ' + filePath
            gc.uploadFileToItem(itemSpec['_id'], filePath)
            fileCount += 1

    printMessage('Uploaded %i datasets as flat files\n' % fileCount)
    return lookupTable


def parseProjectMetadata(datasetIdLookup):
    projects = {}
    badProjects = 0

    items = os.listdir('./library/Projects')
    for item in items:
        metaPath = './library/Projects/' + item + '/metadata.json'
        if not os.path.isdir('./library/Projects/' + item) or \
           not os.path.isfile(metaPath):
            continue

        temp = open(metaPath, 'rb')
        contents = temp.read()
        metadata = json.loads(contents)
        temp.close()

        for i, d in enumerate(metadata['datasets']):
            if d['itemId'] not in datasetIdLookup:
                # Hmm... the dataset that this project is
                # referring to doesn't exist.
                metadata = None
                break
            else:
                metadata['datasets'][i]['dataset'] = datasetIdLookup[d['itemId']]

        if metadata is None:
            badProjects += 1
        else:
            projects[item] = metadata

    message = 'Identified %i project metadata files' % len(projects)
    if badProjects > 0:
        message += '\nWARNING: could not find the datasets\n' + \
                   'corresponding to %i projects!' % badProjects
    printMessage(message)

    return projects


def createProjects(collectionId, projects):
    lookupTable = {}
    folderSpec = gc.load_or_create_folder('Projects', collectionId, 'collection')
    for projectName, metadata in projects.iteritems():
        itemSpec = gc.load_or_create_item(projectName, folderSpec['_id'])
        lookupTable[projectName] = itemSpec['_id']

    printMessage('Created %i project items' % len(projects))

    return lookupTable


def attachMetadata(datasets, datasetIdLookup, projects, projectIdLookup):
    datasetMetaCount = 0
    projectMetaCount = 0
    for datasetName, datasetId in datasetIdLookup.iteritems():
        # Hit the endpoint that identifies the item as
        # a Resonant Lab dataset
        response = gc.sendRestRequest('POST', 'item/' + datasetId + '/dataset')
        if datasets[datasetName]['metadata'] is not None:
            # Attach the custom metadata
            meta = response.get('meta', {})
            rlab = meta.get('rlab', {})
            rlab.update(datasets[datasetName]['metadata'])
            meta['rlab'] = rlab
            gc.addMetadataToItem(datasetId, meta)
            datasetMetaCount += 1
    for projectName, projectId in projectIdLookup.iteritems():
        # Hit the endpoint that identifies the item
        # as a Resonant Lab project
        response = gc.sendRestRequest('POST', 'item/' + projectId + '/project')
        # Attach the custom metadata
        meta = response.get('meta', {})
        rlab = meta.get('rlab', {})
        rlab.update(projects[projectName])
        meta['rlab'] = rlab
        gc.addMetadataToItem(projectId, meta)
        projectMetaCount += 1

    printMessage('Attached metadata to %i datasets and %i projects' %
                 (datasetMetaCount, projectMetaCount))


if __name__ == '__main__':
    args = getArguments()
    gc = authenticate(args)
    collectionId = getLibraryCollection(gc)

    # Set up the datasets
    datasets = getDatasets()
    datasetIdLookup = {}
    # Mongo datasets first
    dbAssetstoreId, dbAssetstoreHost = getDBassetstore(gc, args.dbAssetstoreId)
    dataFolderId, datasetIdLookup = createMongoCollections(args,
                                                           dbAssetstoreHost,
                                                           datasets,
                                                           dbAssetstoreId,
                                                           collectionId)

    # Now for the regular files
    fsAssetstoreId = getFSassetstore(gc)
    datasetIdLookup.update(uploadFlatFiles(dataFolderId, datasets))

    # Set up the projects
    projects = parseProjectMetadata(datasetIdLookup)
    projectIdLookup = createProjects(collectionId, projects)

    # Hit the appropriate endpoints and attach metadata where it exists
    attachMetadata(datasets, datasetIdLookup, projects, projectIdLookup)

    print 'Done!'
