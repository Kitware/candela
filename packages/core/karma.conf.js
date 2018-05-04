var path = require('path');

var kconfig = {
  singleRun: true,
  client: {
    captureConsole: false
  },
  browsers: [
    'ChromeHeadless'
  ],
  frameworks: [
    'tap'
  ],
  reporters: [
    'tap-pretty'
  ],
  tapReporter: {
    prettify: require('tap-spec')
  },
  files: [
    'build/test.unit.js'
  ]
};

if (process.env.COVERAGE) {
  kconfig.files = [
    'build/test.coverage.js'
  ];
  kconfig.reporters = [
    'coverage-istanbul'
  ];
  kconfig.coverageIstanbulReporter = {
    reports: ['text-summary', 'html'],
    dir: path.resolve('../../build/coverage'),
    'report-config': {
      html: {
        subdir: 'html/core'
      }
    }
  };
}

module.exports = function (config) {
  config.set(kconfig);
};
