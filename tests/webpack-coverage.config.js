var config = require('./webpack.config');

config.output.filename = 'coverage.js';

config.module.preLoaders = [
  {
    test: /\.js$/,
    include: [
      /node_modules\/candela\//
    ],
    exclude: /\/test\//,
    loader: 'babel-istanbul-loader',
    query: {
      presets: ['es2015']
    }
  }
];

module.exports = config;
