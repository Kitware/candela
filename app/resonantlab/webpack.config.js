var fs = require('fs');
var webpack = require('webpack');
var GruntWatchPlugin = require('./grunt-watch-plugin.js');

var entry = ['./mainPage.js'];

var gaKey = process.env.GOOGLE_ANALYTICS_KEY;
if (gaKey) {
  var gaTemplate = fs.readFileSync('gaTemplate.js', {
    encoding: 'utf-8'
  });

  var gaText = gaTemplate.replace('${GOOGLE_ANALYTICS_KEY}', gaKey);
  fs.writeFileSync('ga.js', gaText);

  entry.push('./ga.js');
}

/*globals module*/
module.exports = {
  entry: entry,
  output: {
    path: 'web_client/lib',
    filename: 'webpack_bundle.js'
  },
  plugins: [
    GruntWatchPlugin,
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
        loader: 'html-loader?attrs=img:src image:xlink:href'
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
        test: /general_purpose\/.*\.js$/,
        loader: 'exports-loader',
        query: 'es6exports'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|web_client|build)/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
