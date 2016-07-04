var webpack = require('webpack');
var path = require('path');

/*globals module*/
module.exports = {
  entry: {
    'query-test': './app/resonant-laboratory/querylang/test/query.js',
  },
  output: {
    path: './build/resonant-laboratory',
    filename: 'tests.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      vg: 'vega'
    })
  ],
  debug: true,
  devtool: 'eval',
  module: {
    loaders: [
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.woff$|\.wav$|\.mp3$|\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$|\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.styl$/,
        loaders: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader?attrs=img:src'
      },
      {
        test: /\.pegjs$/,
        loader: 'pegjs-loader'
      },
      {
        test: /\.json$/,
        loaders: ['json-loader', 'strip-json-comments-loader']
      },
      {
        test: /\.jade$/,
        loaders: ['jade-loader']
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
  },
  node: {
    fs: 'empty'
  }
};
