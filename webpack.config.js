var path = require('path');

var candelaWebpack = require('./webpack');

var config = {
  entry: {
    'candela-all': path.resolve('candela-all.js')
  },
  output: {
    library: 'candela-all',
    libraryTarget: 'umd',
    path: path.resolve('dist'),
    filename: process.env.NODE_ENV === 'production' ? '[name].min.js' : '[name].js'
  },
  resolve: {
    alias: {
      candela: path.resolve('.')
    }
  }
};

module.exports = candelaWebpack(config, path.resolve('.'));
