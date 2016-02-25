var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src',
  output: {
    library: 'harmony',
    libraryTarget: 'umd',
    path: 'web_client/extra',
    filename: 'harmony.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      vg: 'vega'
    })
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
        }
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
