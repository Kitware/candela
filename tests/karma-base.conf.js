module.exports = {
  singleRun: true,
  client: {
    captureConsole: true
  },
  browsers: [
    'PhantomJS'
  ],
  files: [
    'build/tests.js'
  ]
};
