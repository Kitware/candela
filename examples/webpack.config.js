var path = require('path');
var webpack = require('webpack');

var candelaLoaders = require('candela/webpack');

var HtmlPlugin = require('html-webpack-plugin');

var examples = require('./index.json');

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
    path: path.resolve('..', 'build/examples'),
    filename: '[name]/index.js'
  },
  plugins: htmlPlugins.concat([
    new webpack.ProvidePlugin({
      jQuery: 'jquery'
    })
  ]),
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        },
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/
      },
      {
        test: /\.csv|\.tsv$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jade$/,
        loader: 'jade-loader',
        exclude: /node_modules/
      },
      {
        test: /\.styl/,
        loaders: ['style-loader', 'css-loader', 'stylus-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css/,
        loaders: ['style-loader', 'css-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loaders: [
          'exports-loader?GLO',
          'imports-loader?_=underscore&cola=webcola'
        ],
        include: /\/node_modules\/glo\/glo\.js$/
      }
    ]
  }
});
