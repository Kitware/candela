var webpack = require('webpack');

/*globals module*/
module.exports = {
  entry: './mainPage.js',
  output: {
    path: 'web_client/extra',
    filename: 'webpack_bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      vg: 'vega'
    })
  ],
  debug: true,
  devtool: 'cheap-source-map',
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.html$/,
        loader: 'html?attrs=img:src'
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        loader: 'url'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
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
