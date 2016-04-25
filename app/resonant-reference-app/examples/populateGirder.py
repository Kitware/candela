#!/usr/bin/env python
import argparse, getpass
import girder_client, os, json, sys

parser = argparse.ArgumentParser(description='''Populate a girder
    installation with example dataset and toolchain collections.
    This script is idempotent, so running it multiple times won't
    result in duplicate files (though it may revert any changes
    that have been made to the elements that it originally added)''')
parser.add_argument('-u, --username', dest='username', default='admin',
    help='The administrator username (default: "admin")')
parser.add_argument('-a, --apiUrl', dest='apiUrl',
    default='http://localhost:8080/api/v1',
    help='''The url of the Girder instance's API endpoint.''')

args = parser.parse_args()
password = getpass.getpass()

gc = girder_client.GirderClient(apiUrl=args.apiUrl)
gc.authenticate(args.username, password)

message = ''

# Get or create the ReferenceApp collection
collection = gc.sendRestRequest('GET','collection',{'text':'ReferenceApp'})
if len(collection) == 0:
    collection = gc.sendRestRequest('POST','collection',
        {'name':'ReferenceApp',
         'description':'The public library for the Reference Application',
         'public':True})
    message += 'Created collection '
else:
    collection = collection[0]
    message += 'Using existing collection '
collectionID = collection['_id']

message += collectionID
print message
print ''.join(['=' for x in message])   # underline


# Walk through this directory, uploading folders into the collection
folders = os.listdir('.')
for f in folders:
    if not os.path.isdir(f):
        continue
    
    print
    print '## Folder: ' + f
    print
    
    folderSpec = gc.load_or_create_folder(f, collectionID, 'collection')
    
    # The second-level directories correspond to items
    items = os.listdir('./' + f)
    if len(items) == 0:
        continue
    
    longestItemName = max([len(i) for i in items])
    
    for i in items:
        print '- Item: ' + i,
        
        spacesNeeded = longestItemName - len(i)
        message = ''.join([' ' for x in xrange(spacesNeeded)])
        
        itemSpec = gc.load_or_create_item(i, folderSpec['_id'])
        files = os.listdir('./' + f + '/' + i)
        
        existingFiles = gc.sendRestRequest('GET',
            'item/' + itemSpec['_id'] + '/files',{})
        existingFiles = set([x['name'] for x in existingFiles])
        
        ignoredFiles = 0
        addedFiles = 0
        addedMetadata = False
        
        # Load each of the files into the item
        for x in files:
            if x == 'metadata.json':
                temp = open('./' + f + '/' + i + '/' + itemMeta, 'rb')
                contents = temp.read()
                metadata = json.loads(contents)
                temp.close()
                gc.addMetadataToItem(itemSpec['_id'], metadata)
                addedMetadata = True
            elif x in existingFiles:
                ignoredFiles += 1
            else:
                fileObj = gc.uploadFileToItem(itemSpec['_id'], './' + f + '/' + i + '/' + x)
                addedFiles += 1
        
        message += '%i file%s loaded' % (addedFiles, '' if addedFiles == 1 else 's')
        message += '\t%i file%s ignored' % (ignoredFiles, '' if ignoredFiles == 1 else 's')
        if addedMetadata is False:
            message += '\tCOULD NOT FIND METADATA'
        else:
            message += '\tattached metadata'
        print message

print 'finished'
print