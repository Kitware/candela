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
    'dist/test.unit.js',
  ]
};

if (process.env.COVERAGE) {
  kconfig.files = [
    'dist/test.coverage.js'
  ];
  kconfig.reporters = [
    'coverage-istanbul'
  ];
  kconfig.coverageIstanbulReporter = {
    reports: ['text-summary', 'html', 'lcovonly'],
    dir: path.resolve('dist/coverage'),
    'report-config': {
      html: {
        subdir: 'html'
      },
      lcovonly: {
        file: 'lcov/lcov.info'
      }
    }
  };
}

module.exports = function (config) {
  config.set(kconfig);
};
