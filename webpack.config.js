var webpack = require('webpack');
var path = require('path');

var CleanPlugin = require('clean-webpack-plugin');

var plugins = [
  new webpack.ProvidePlugin({
    vg: 'vega'
  }),

  new CleanPlugin(['./dist/resplendent.js', './dist/common.js', './dist/index.js'])
];

module.exports = {
  entry: {
    resplendent: './src/resplendent.js',
    index: './src/index.js'
  },
  output: {
    library: '[name]',
    libraryTarget: 'umd',
    path: 'dist',
    filename: '[name].js',
  },
  resolve: {
    alias: {
      vega: path.resolve(__dirname, 'node_modules/vega/index.js'),
      d3: path.resolve(__dirname, 'node_modules/d3/d3.min.js')
    }
  },
  plugins: plugins,
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
        test: function (path) {
          return path.endsWith('/src/external/pc.js');
        },
        loader: 'legacy'
      },
      {
        test: /\.styl$/,
        loaders: ['style', 'css', 'stylus']
      },
      {
        test: /\.jade$/,
        loaders: ['jade']
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
};
