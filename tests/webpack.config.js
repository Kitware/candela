var path = require('path');
var fs = require('fs');

var webpack = require('webpack');

var candelaWebpack = require('../webpack');

var defs = (() => {
  var filebase = [
    'candela',
    'glo',
    'mixin',
    'sententree',
    'trackerdash',
    'upset',
    'geojs',
    'lineup',
    'onset',
    'similaritygraph',
    'treeheatmap',
    'vega'
  ];

  var defs = {};

  filebase.forEach(fb => {
    try {
      fs.accessSync(`../dist/${fb}.js`);
      defs[`${fb.toUpperCase()}_JS`] = 'true';
    } catch (e) {
      defs[`${fb.toUpperCase()}_JS`] = 'false';
    }

    try {
      fs.accessSync(`../dist/${fb}.min.js`);
      defs[`${fb.toUpperCase()}_MIN_JS`] = 'true';
    } catch (e) {
      defs[`${fb.toUpperCase()}_MIN_JS`] = 'false';
    }
  });

  return defs;
})();

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
          path.resolve('../plugins')
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
