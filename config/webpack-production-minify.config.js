var config = require('./webpack-production.config');

var webpack = require('webpack');

config.output.filename = 'candela.min.js';

config.plugins.push(new webpack.optimize.UglifyJsPlugin({
  sourceMap: false,
  compress: {
    unused: false,
    warnings: false
  }
}));

module.exports = config;
