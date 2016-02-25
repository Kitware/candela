resonant-reference-app
======================
A UX prototype for the whole resonant-supported workflow

# Building / Running

## Prerequisites
Technically, you only need (node.js)[https://nodejs.org/en/download/].

Then type this in the terminal:

    cd resonant-reference-app
    npm install

However, for easy running/development, you'll probably want
to do this as well (may need sudo, depending on your setup):

    npm install -g webpack-dev-server

## To run locally / develop

    webpack-dev-server --progress --colors --hot --content-base _build

You will see the results at [localhost:8080](http://localhost:8080).

You *won't* see the built site (`webpack-dev-server` will
create `_build` in memory, not disk!). Because of this,
changes that you save should be visible right away.

## To build
If you've installed webpack globally:

    webpack -p --progress --colors

If not, `npm install` will have given you a local copy:

    node_modules/webpack/bin/webpack.js -p --progress --colors
    
The resulting minified site will be in _build