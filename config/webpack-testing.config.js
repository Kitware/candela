var path = require('path');
var webpack = require('webpack');

var config = require('./webpack.config');

__dirname = config.__dirname;

config.entry = {
  'tests.bundle': path.resolve(__dirname, 'testing/tests.bundle.js')
};

config.devtool = 'inline-source-map';

config.plugins = [
  new webpack.ProvidePlugin({
    vg: 'vega'
  })
];

config.node = {
  fs: 'empty'
};

module.exports = config;
