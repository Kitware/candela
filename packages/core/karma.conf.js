var path = require('path');

module.exports = function (config) {
  config.set({
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
  });
};
