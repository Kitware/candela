var candelaWebpack = require('../webpack');

module.exports = candelaWebpack({
  entry: {
    tests: './tests.js'
  },
  output: {
    path: 'build',
      filename: 'tests.js'
  },
  devtool: 'inline-source-map',
  node: {
    fs: 'empty'
  }
});
