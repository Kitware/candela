var karmaConfig = require('./karma-base.conf');
var webpackConfig = require('./webpack.config');

karmaConfig.webpack = webpackConfig;

karmaConfig.reporters = [
  'quiet'
];

module.exports = function (config) {
  config.set(karmaConfig);
};
