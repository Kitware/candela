var webpack = require('webpack');

var config = require('./webpack.config');

__dirname = config.__dirname;

config.entry = {
  'tests.bundle': './tests.bundle.js'
};

config.devtool = 'inline-source-map';

config.node = {
  fs: 'empty'
};

config.module.loaders.forEach(function (loader) {
  if (loader.loader !== 'babel-loader' && loader.tag !== 'glo') {
    delete loader.include;
  }
});

delete config.plugins;

module.exports = config;
