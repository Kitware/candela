var karmaConfig = require('./karma-base.conf');
var webpackConfig = require('./webpack-testing.config');

karmaConfig.webpack = webpackConfig;

karmaConfig.reporters = [
  'tap'
];

karmaConfig.tapReporter = {
  disableStdout: true
};

module.exports = function (config) {
  config.set(karmaConfig);
};
