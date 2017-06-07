var karmaConfig = require('./karma-base.conf');

karmaConfig.files[0] = '../build/tests/coverage.js';

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
      dir: '../build/coverage/',
      subdir: 'html'
    },
    {
      type: 'lcovonly',
      dir: '../build/coverage',
      subdir: 'lcov'
    }
  ]
};

module.exports = function (config) {
  config.set(karmaConfig);
};
