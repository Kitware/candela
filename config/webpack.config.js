var webpack = require('webpack');
var path = require('path');

var CleanPlugin = require('clean-webpack-plugin');

var candelaWebpack = require('../webpack');

__dirname = path.resolve(__dirname, '..');

var externals = {};
var external_packages = [
  'crypt',
  'd3',
  'd3-array',
  'd3-scale',
  'd3-selection',
  'd3-shape',
  'datalib',
  'font-awesome-webpack',
  'geojs',
  'jquery',
  'lineupjs',
  'lineupjs/build/style.css',
  'md5',
  'nvd3',
  'onset',
  'sententree',
  'telegraph-events',
  'underscore',
  'UpSet',
  'vega',
  'webcola'
].forEach(function (ext) {
  externals[ext] = true;
});

module.exports = candelaWebpack({
  devtool: 'source-map',
  __dirname: __dirname,
  entry: {
    candela: './candela.js',
  },
  output: {
    library: '[name]',
    libraryTarget: 'umd',
    path: 'build',
    filename: '[name]/[name].js'
  },
  externals: externals,
  plugins: [
    new CleanPlugin([path.resolve(__dirname, 'build/candela')], {
      root: __dirname
    }),
  ]
}, __dirname);
