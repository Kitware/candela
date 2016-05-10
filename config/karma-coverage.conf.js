var karmaConfig = require('./karma-base.conf');
var webpackConfig = require('./webpack-coverage.config');

karmaConfig.webpack = webpackConfig;

karmaConfig.reporters = [
  'coverage'
];

karmaConfig.coverageReporter = {
  reporters: [
    {
      type: 'text-summary'
    },

    {
      type: 'html',
      dir: 'coverage/',
      subdir: 'html'
    },

    {
      type: 'lcovonly',
      dir: 'coverage',
      subdir: 'lcov'
    }
  ]
};

module.exports = function (config) {
  config.set(karmaConfig);
};
