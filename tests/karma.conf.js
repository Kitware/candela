var kconfig = {
  singleRun: true,
  client: {
    captureConsole: true
  },
  browsers: [
    'PhantomJS'
  ],
  frameworks: [
    'tap'
  ],
  reporters: null,
  coverageReporter: null,
  files: null
};

if (process.env.CANDELA_COVERAGE) {
  kconfig.files = [
    '../build/tests/coverage.js'
  ];
  kconfig.reporters = [
    'coverage'
  ];
  kconfig.coverageReporter = {
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
} else {
  kconfig.files = [
    '../build/tests/unit.js'
  ];
  kconfig.reporters = [
    'quiet'
  ];
  delete kconfig.coverageReporter;
}

module.exports = function (config) {
  config.set(kconfig);
};
