module.exports = {
  singleRun: true,
  client: {
    captureConsole: true
  },
  frameworks: [
    'tap'
  ],
  browsers: [
    'PhantomJS'
  ],
  files: [
    'build/tests.js'
  ]
};
