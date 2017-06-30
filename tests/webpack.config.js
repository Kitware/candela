var path = require('path');

var candelaWebpack = require('../webpack');

var config = {
  entry: {
    tests: './tests.js'
  },
  output: {
    path: path.resolve('..', 'build/tests'),
    filename: null
  },
  resolve: {
    alias: {
      candela: path.resolve('..')
    }
  },
  node: {
    fs: 'empty'
  }
};

if (process.env.CANDELA_COVERAGE) {
  config.devtool = 'cheap-module-source-map';
  config.output.filename = 'coverage.js';
  config.module = {
    rules: [
      {
        enforce: 'post',
        test: /\.js$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: {
            esModules: true
          }
        },
        include: [
          path.resolve('../index.js'),
          path.resolve('../util'),
          path.resolve('../VisComponent'),
          path.resolve('../plugins')
        ],
        exclude: /\/test\//
      }
    ]
  };
} else {
  config.output.filename = 'unit.js';
}

module.exports = candelaWebpack(config, path.resolve('..'), {
  excludeCandelaNM: false
});
