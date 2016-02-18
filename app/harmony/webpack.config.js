var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './src',
  output: {
    library: 'harmony',
    libraryTarget: 'umd',
    path: 'dist',
    filename: 'harmony.js'
  },
  resolve: {
    alias: {
      vega: path.resolve(__dirname, '../../node_modules/vega/index.js'),
      d3: path.resolve(__dirname, '../../node_modules/d3/d3.min.js')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      vg: 'vega'
    }),
    new CopyWebpackPlugin([{
      from: './index.html',
      to: './index.html'
    }])
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'semistandard',
        include: path.resolve(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'src', 'external')
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        },
        include: __dirname + '/src'
      },
      {
        test: /\.styl$/,
        loaders: ['style', 'css', 'stylus']
      },
      {
        test: /\.jade$/,
        loader: 'jade'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
};
