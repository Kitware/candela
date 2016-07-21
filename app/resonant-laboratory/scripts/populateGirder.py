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
    parser.add_argument('-d', dest='databaseThreshold', default='131072',
                        help='If a file exceeds this threshold (in bytes), upload it as a ' +
                        'mongo database collection instead of a flat file.')
    parser.add_argument('-n', dest='dbName',
                        default='resonantLaboratoryLibrary',
                        help='The name of the mongo db to use for larger files.')

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


def getDbAssetStore(gc):
    # Get the database assetstore ID and hostname+port
    assetstores = gc.sendRestRequest('GET', 'assetstore/', {}, "")
    assetstores = filter(lambda x: x['current'] is True, assetstores)

    if not len(assetstores) == 1:
        print 'Could not find the current assetstore'
        sys.exit(1)
    if not assetstores[0]['type'] == 'database' or \
            assetstores[0]['database']['dbtype'] != 'mongo':
        print 'For this script to work, the current assetstore must be a mongo-based database assetstore'
        sys.exit(1)
    assetstoreID = assetstores[0]['_id']
    assetstoreHost = assetstores[0]['database']['uri'].split('/')[2]
    message = 'Identified database assetstore ' + assetstoreID
    message += '\nhost: ' + assetstoreHost
    printMessage(message)

    return assetstoreID, assetstoreHost


def getLibraryCollection(gc):
    # Get or create the ResonantLaboratory collection
    message = ''
    collection = gc.sendRestRequest('GET', 'collection',
                                    {'text': 'Resonant Laboratory Library'})

    # Trash the existing ResonantLaboratory collection
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
    collectionID = collection['_id']

    message += collectionID
    printMessage(message)

    return collectionID


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
                datasets[item]['metadata'] = filePath
            else:
                fileSize = os.stat(filePath).st_size
                if (fileSize > int(args.databaseThreshold)) or os.path.splitext(fileName)[1] == '.json':
                    datasets[item]['collections'][fileName] = filePath
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
            # print subprocess.check_output(command, stderr=subprocess.STDOUT)
    # Hit the /database_assetstore/{id}/import endpoint to load all these
    # collections as files in girder
    collectionNames = [{'database': args.dbName, 'name': n, 'table': n} for n in collectionNames]
    endpoint = 'database_assetstore/' + dbId + '/import'
    parameters = {
        'parentId': parentId,
        'table': json.dumps(collectionNames),
        'parentType': 'collection'
    }
    gc.sendRestRequest('PUT', endpoint, parameters)

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

    # Now we want to get the IDs of all the items that we just created
    itemList = gc.sendRestRequest('GET', 'item', {'folderId': dataFolder[0]['_id']})

    # Create a lookup table to find IDs by name
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

    printMessage('Uploaded %i datasets as flat files' % fileCount)
    return lookupTable


def getProjects(datasetIdLookup):
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

    message = 'Identified %i projects' % len(projects)
    if badProjects > 0:
        message += '\nWARNING: could not find the datasets\n' + \
                   'corresponding to %i projects!' % badProjects
    printMessage(message)

    return projects


if __name__ == '__main__':
    args = getArguments()
    gc = authenticate(args)
    assetstoreID, assetstoreHost = getDbAssetStore(gc)
    collectionID = getLibraryCollection(gc)

    # Set up the datasets
    datasets = getDatasets()
    datasetIdLookup = {}
    # Mongo datasets first
    dataFolderId, datasetIdLookup = createMongoCollections(args,
                                                           assetstoreHost,
                                                           datasets,
                                                           assetstoreID,
                                                           collectionID)
    # Now for the regular files
    datasetIdLookup.update(uploadFlatFiles(dataFolderId, datasets))

    # TODO: Set up the projects
    projects = getProjects(datasetIdLookup)

    print datasets, datasetIdLookup, projects
    sys.exit(0)
'''
    # Create the Data and Projects folders
    dataItemIdLookup = {}
    for folder in ['library/Data', 'library/Projects']:
        if not os.path.isdir(folder):
            continue

        print
        print '## ' + folder + ':'
        print ''

        folderSpec = gc.load_or_create_folder(os.path.split(folder)[1],
                                              collectionID,
                                              'collection')

        # The second-level directories correspond to items
        items = os.listdir('./' + folder)
        if len(items) == 0:
            continue

        longestItemName = max([len(item) for item in items])

        message = 'Item' + ''.join([' ' for x in xrange(longestItemName - 3)])
        message += ' | Ignored files | Flat files added | DB Collections added | Metadata attached | Suppressed Item'
        print message
        print ''.join(['=' for x in message])   # underline

        for item in items:
            if not os.path.isdir('./' + folder + '/' + item):
                continue
            print item,
            suppressItem = False

            spacesNeeded = longestItemName - len(item)
            message = ''.join([' ' for x in xrange(spacesNeeded)])

            # Create (or get) the item
            itemSpec = gc.load_or_create_item(item, folderSpec['_id'])

            # If this is a dataset, store its ID for Projects
            # to look up later
            if folder == 'library/Data':
                dataItemIdLookup[item] = itemSpec['_id']

            # Now upload any files that don't already
            # exist in the item
            files = os.listdir('./' + folder + '/' + item)

            existingFiles = gc.sendRestRequest('GET', 'item/' + itemSpec['_id'] + '/files', {})
            existingFiles = set([x['name'] for x in existingFiles])

            ignoredFiles = 0
            addedFiles = 0
            addedCollections = 0
            skippedFiles = 0
            metadata = None

            # Load each of the files into the item
            for fileName in files:
                if fileName == 'metadata.json':
                    # metadata.json is special; attach it as the item's
                    # metadata instead of uploading it as a file
                    temp = open('./' + folder + '/' + item + '/metadata.json', 'rb')
                    contents = temp.read()
                    metadata = json.loads(contents)
                    temp.close()

                    # If this is a project, we need to replace the dataset
                    # folder name with a Girder ID
                    if folder == 'examples/Projects':
                        for i, d in enumerate(metadata['datasets']):
                            if d['itemId'] not in dataItemIdLookup:
                                # Hmm... the dataset that this project is
                                # referring to doesn't exist
                                suppressItem = True
                            else:
                                metadata['datasets'][i]['dataset'] = dataItemIdLookup[d['itemId']]
                elif fileName in existingFiles:
                    ignoredFiles += 1
                else:
                    fileSize = os.stat('./' + folder + '/' + item + '/' + fileName).st_size
                    if (fileSize > int(args.databaseThreshold)) or os.path.splitext(fileName)[1] == '.json':
                        createMongoCollection(args, './' + folder + '/' + item + '/', fileName)
                        gc.sendRestRequest('PUT', 'database_assetstore/' + itemSpec['_id'] + '/import', {}, json.dumps({
                            'url': args.mongoHost + ':' + args.mongoPort,
                            'database': args.dbName,
                            'collection': os.path.splitext(fileName)[0],
                            'type': 'mongo'
                        }))
                        addedCollections += 1
                    else:
                        gc.uploadFileToItem(itemSpec['_id'], './' + folder + '/' + item + '/' + fileName)
                        addedFiles += 1

            if suppressItem:
                gc.delete('item/' + itemSpec['_id'])
            else:
                # Hit the endpoint that identifies the item as a dataset or a project,
                # and populates the metadata appropriately
                if folder == 'examples/Data':
                    response = gc.sendRestRequest('POST', 'item/' + itemSpec['_id'] + '/dataset')
                elif folder == 'examples/Projects':
                    response = gc.sendRestRequest('POST', 'item/' + itemSpec['_id'] + '/project')
                # Add any additional metadata that has been supplied
                # (e.g. schema settings)
                if metadata is not None:
                    meta = response.get('meta', {})
                    rlab = meta.get('rlab', {})
                    rlab.update(metadata)
                    meta['rlab'] = rlab
                    gc.addMetadataToItem(itemSpec['_id'], meta)

            message += ' | %i             | %i                | %i                    | %s                 | %s' % (
                ignoredFiles, addedFiles, addedCollections,
                'N' if metadata is None else 'Y',
                'Y' if suppressItem else 'N')
            print message

    print 'finished'
    print
'''
