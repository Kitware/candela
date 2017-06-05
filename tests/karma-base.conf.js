module.exports = {
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
  files: [
    'build/tests.js'
  ],
  webpackServer: {
    noInfo: true
  }
};
