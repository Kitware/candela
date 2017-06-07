var candelaWebpack = require('../webpack');

var config = {
  entry: {
    tests: './tests.js'
  },
  output: {
    path: '../build/tests',
    filename: null
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
          /node_modules\/candela\//
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

module.exports = candelaWebpack(config);
