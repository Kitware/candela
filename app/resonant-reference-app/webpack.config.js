var webpack = require('webpack');
var GruntWatchPlugin = require('./grunt-watch-plugin.js');

/*globals module*/
module.exports = {
  entry: './mainPage.js',
  output: {
    path: 'web_client/extra',
    filename: 'webpack_bundle.js'
  },
  plugins: [
    GruntWatchPlugin,
    new webpack.ProvidePlugin({
      vg: 'vega'
    })
  ],
  debug: true,
  devtool: 'cheap-source-map',
  module: {
    loaders: [
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.woff$|\.wav$|\.mp3$|\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$|\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.html$/,
        loader: 'html?attrs=img:src'
      },
      {
        test: /\.json$/,
        loaders: ['json', 'strip-json-comments-loader']
      },
      {
        test: /\.jade$/,
        loaders: ['jade']
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|web_client)/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
