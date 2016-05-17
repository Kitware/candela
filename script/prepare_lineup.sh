#!/bin/sh

cd node_modules/LineUpJS
# We need the devel dependencies, so we have to npm install in the local 
# directory
npm install < /dev/null
# node doesn't pull down the src/myumd.js file from git, but the Gruntfile
# requires the existence of such a file, so create the simplest possible form
# of it.
echo 'SOURCECODE' > src/myumd.js
# Grunt throws a linting error.  Ignore it.
grunt --force < /dev/null

cd ../..
