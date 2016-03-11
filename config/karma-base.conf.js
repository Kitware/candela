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
    'tests.bundle.js'
  ],
  preprocessors: {
    'tests.bundle.js': [
      'webpack',
      'sourcemap'
    ]
  },
  webpackServer: {
    noInfo: true
  }
};
