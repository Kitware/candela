var path = require('path');
var fs = require('fs');

var webpack = require('webpack');

var candelaWebpack = require('../webpack');

var defs = {
  CANDELA_JS_MISSING: 'false',
  CANDELA_MIN_JS_MISSING: 'false'
};

try {
  fs.accessSync('../dist/candela.js');
} catch (e) {
  defs.CANDELA_JS_MISSING = 'true';
}

try {
  fs.accessSync('../dist/candela.min.js');
} catch (e) {
  defs.CANDELA_MIN_JS_MISSING = 'true';
}

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
  plugins: [
    new webpack.DefinePlugin(defs)
  ],
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
