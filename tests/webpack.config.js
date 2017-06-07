var candelaWebpack = require('../webpack');

module.exports = candelaWebpack({
  entry: {
    tests: './tests.js'
  },
  output: {
    path: '../build/tests',
    filename: 'unit.js'
  },
  node: {
    fs: 'empty'
  }
});
