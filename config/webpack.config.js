var webpack = require('webpack');
var path = require('path');

var CleanPlugin = require('clean-webpack-plugin');

var candelaWebpack = require('../webpack');

__dirname = path.resolve(__dirname, '..');

module.exports = candelaWebpack({
  devtool: 'source-map',
  __dirname: __dirname,
  entry: {
    candela: './index.js',
  },
  output: {
    library: '[name]',
    libraryTarget: 'umd',
    path: 'build',
    filename: '[name]/[name].js'
  },
  plugins: [
    new CleanPlugin([path.resolve(__dirname, 'build/candela')], {
      root: __dirname
    }),
  ],
  resolve: {
    alias: {
      'font-awesome-webpack$': path.resolve('shim', 'font-awesome-webpack.shim.js')
    }
  }
}, __dirname);
