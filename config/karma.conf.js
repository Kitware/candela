module.exports = {
  basePath: '..',
  singleRun: true,
  client: {
    captureConsole: false
  },
  browsers: [
    'PhantomJS'
  ],
  frameworks: [
    'tap'
  ],
  files: [
    'testing/tests.bundle.js'
  ],
  preprocessors: {
    'testing/tests.bundle.js': [
      'webpack',
      'sourcemap'
    ]
  },
  webpackServer: {
    noInfo: true
  }
};
