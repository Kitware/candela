var webpack = require('webpack');
var path = require('path');

var CleanPlugin = require('clean-webpack-plugin');

var candelaWebpack = require('../webpack');

var rootDir = path.resolve(__dirname, '..');
var buildDir = path.resolve(rootDir, 'build');
var buildDirCandela = path.resolve(buildDir, 'candela');

process.traceDeprecation = true;

module.exports = candelaWebpack({
  // devtool: 'source-map',
  context: rootDir,
  entry: {
    candela: './candela.js',
  },
  output: {
    library: '[name]',
    libraryTarget: 'umd',
    path: buildDir,
    filename: '[name]/[name].js'
  },
  plugins: [
    new CleanPlugin([buildDirCandela], {
      root: rootDir
    }),
  ]
}, rootDir);
