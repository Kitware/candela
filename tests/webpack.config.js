var path = require('path');

var candelaWebpack = require('../webpack');

var config = {
  entry: {
    tests: './tests.js'
  },
  output: {
    path: '../build/tests',
    filename: null
  },
  resolve: {
    alias: {
      candela: path.resolve('..')
    }
  },
  module: null,
  node: {
    fs: 'empty'
  }
};

if (process.env.CANDELA_COVERAGE) {
  config.output.filename = 'coverage.js';
  config.module = {
    preLoaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve('../candela.js'),
          path.resolve('../test'),
          path.resolve('../util'),
          path.resolve('../VisComponent'),
          path.resolve('../packages')
        ],
        exclude: /\/test\//,
        loader: 'babel-istanbul-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  };
} else {
  config.output.filename = 'unit.js';
  delete config.module;
}

module.exports = candelaWebpack(config, path.resolve('..'));
