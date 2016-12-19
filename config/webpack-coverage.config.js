var path = require('path');

var config = require('./webpack-testing.config');

var basePath = path.resolve(__dirname, '..');

config.module.preLoaders = [
  {
    test: /\.js$/,
    include: [
      basePath + '/index.js',
      basePath + '/components',
      basePath + '/test',
      basePath + '/util',
      basePath + '/VisComponent'
    ],
    exclude: /(external|node_modules|test)/,
    loader: 'babel-istanbul-loader',
    query: {
      presets: ['es2015']
    }
  }
];

module.exports = config;
