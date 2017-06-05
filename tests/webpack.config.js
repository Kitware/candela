// var webpack = require('webpack');
var candelaWebpack = require('../webpack');

var config = {};

config.entry = {
  'tests': './tests.js'
};

config.devtool = 'inline-source-map';

config.node = {
  fs: 'empty'
};

config.output = {
  path: 'build',
  filename: 'tests.js'
};
config.module = {
  loaders: [
    {
      test: /\.css/,
      loaders: ['style-loader', 'css-loader'],
      include: /node_modules\/nvd3/,
    },
  ]
};
delete config.plugins;

var final = candelaWebpack(config);

module.exports = final;
