#!/bin/sh

# To work with webpack, we want to include the non-browserified source.  LineUp
# uses typescript, so we need to compile the typescript.  If the javascript
# files exist, then we've probably already done this, so skip doing it again.
if [ ! -f node_modules/LineUpJS/src/main.js ]; then

  cd node_modules/LineUpJS

  # We need the devel dependencies, so we have to npm install in the local 
  # directory
  npm install < /dev/null

  # node doesn't pull down the src/myumd.js file from git, but the Gruntfile
  # requires the existence of such a file, so create the simplest possible form
  # of it.
  echo 'SOURCECODE' > src/myumd.js

  # Grunt throws a linting error.  Ignore it.  Grunt compiles the typescript.
  # It also does quite a bit more, but the typescript compilation is the only
  # part we care about.  We don't need to compile the sass files, as the css
  # file is included in the dist directory.
  grunt --force ts:dev < /dev/null

  cd ../..

fi
