var config = require('./webpack.config');

config.entry = {
  'tests.bundle': 'testing/tests.bundle.js'
};

config.devtool = 'inline-source-map';

config.plugins = [
  new webpack.ProvidePlugin({
    vg: 'vega'
  })
];

config.node = {
  fs: 'empty'
};

module.exports = config;
