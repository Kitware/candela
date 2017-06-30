var path = require('path');

var kconfig = {
  singleRun: true,
  client: {
    captureConsole: null
  },
  browsers: [
    'PhantomJS'
  ],
  frameworks: [
    'tap'
  ],
  reporters: null,
  files: null
};

if (process.env.CANDELA_COVERAGE) {
  kconfig.client.captureConsole = false;
  kconfig.files = [
    '../build/tests/coverage.js'
  ];
  kconfig.reporters = [
    'coverage-istanbul'
  ];
  kconfig.coverageIstanbulReporter = {
    reports: ['text-summary', 'html', 'lcovonly'],
    dir: path.resolve('..', 'build/coverage'),
    'report-config': {
      html: {
        subdir: 'html'
      },
      lcovonly: {
        file: 'lcov/lcov.info'
      }
    }
  };
} else {
  kconfig.client.captureConsole = true;
  kconfig.files = [
    '../build/tests/unit.js'
  ];
  kconfig.reporters = [
    'quiet'
  ];
}

module.exports = function (config) {
  config.set(kconfig);
};
