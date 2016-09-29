'''
A helper script that extracts and prints the characters in each locale
(used to construct general_purpose/localeIndexes.json and
general_purpose/characterLookup.json).
To execute, first download and extract

http://www.unicode.org/Public/cldr/ < latest version > /core.zip

into this directory.
'''

import os
import json
from xml.dom import minidom


def getNodeText(node):
    nodelist = node.childNodes
    result = []
    for node in nodelist:
        if node.nodeType == node.TEXT_NODE:
            result.append(node.data)
    return ''.join(result)


path = './core/common/main'

indexFile = open('../general_purpose/localeIndexes.json', 'wb')
indexFile.write('{')
firstLine = True

characterLookup = {}

print 'locale', 'chars', 'new', 'index'

for f in os.listdir(path):
    doc = minidom.parse(os.path.join(path, f))
    exemplarTags = doc.getElementsByTagName('exemplarCharacters')

    if len(exemplarTags) > 0:
        localeName = os.path.splitext(f)[0]

    for exemplarTag in exemplarTags:
        numCharacters = 0
        newCharacters = 0
        indexDiscovered = False
        characterList = getNodeText(exemplarTag)
        characterList = characterList[1:-1].split()
        for i, c in enumerate(characterList):
            if c.startswith('{') and c.endswith('}'):
                characterList[i] = c = c.strip('{').strip('}')
            if c not in characterLookup:
                newCharacters += 1
                characterLookup[c] = set()
            characterLookup[c].add(localeName)
            numCharacters += 1

        if exemplarTag.getAttribute('type') == 'index':
            indexDiscovered = True
            characterList = json.dumps(characterList)

            if not firstLine:
                indexFile.write(',')
            else:
                firstLine = False
            indexFile.write('\n  "' + localeName + '":' + characterList)

        print localeName, numCharacters, newCharacters, indexDiscovered
indexFile.write('\n}')
indexFile.close()

'''
TODO: For now, histograms just rely on the locale information passed from the
browser's HTTP headers, or 'en' if that fails. It should be possible to figure
out the set of possible locales from the characters that are encountered in the
inferSchema stage, in the same way that we figure out the low/high bounds of
number bins. For that, we'd need a transposed version of indexFile:

print 'Writing character file...'

characterFile = open('../general_purpose/characterLookup.json', 'wb')
characterFile.write('{')
firstLine = True
for c, locales in characterLookup.iteritems():
    if not firstLine:
        characterFile.write(',')
    else:
        firstLine = False
    localeList = json.dumps(list(locales))
    characterFile.write('\n  ' + json.dumps(c) + ':' + localeList)
characterFile.write('\n}')
characterFile.close()
'''
