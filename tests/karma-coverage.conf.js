var karmaConfig = require('./karma-base.conf');

karmaConfig.files[0] = 'build/coverage.js';

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
