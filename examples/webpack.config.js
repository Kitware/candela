var webpack = require('webpack');
var candelaLoaders = require('../webpack');
var path = require('path');

var HtmlPlugin = require('html-webpack-plugin');

var examples = require('./examples.json');

var entryPoints = examples.map(function (ex) {
  return {
    key: ex.link,
    value: './' + ex.link + '/index.js'
  };
});

var entry = {};
entryPoints.forEach(function (ep) {
  entry[ep.key] = ep.value;
});

var htmlPlugins = examples.map(function (ex) {
  return new HtmlPlugin({
    title: ex.title,
    filename: ex.link + '/index.html',
    chunks: [ex.link]
  });
});

module.exports = candelaLoaders({
  entry: entry,
  output: {
    path: 'build',
    filename: '[name]/index.js'
  },
  plugins: htmlPlugins,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/
      },
      {
        test: /\.csv|\.tsv$/,
        loader: 'raw-loader'
      }
    ]
  }
});
