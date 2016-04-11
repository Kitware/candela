var webpack = require('webpack');
var path = require('path');

var CleanPlugin = require('clean-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');

__dirname = path.resolve(__dirname, '..');

module.exports = {
  devtool: 'source-map',
  __dirname: __dirname,
  entry: {
    candela: ['./src/candela/index.js'],
    examples: './app/examples/index.js'
  },
  output: {
    library: '[name]',
    libraryTarget: 'umd',
    path: 'build',
    filename: '[name]/[name].js'
  },
  resolve: {
    alias: {
      vega: path.resolve(__dirname, 'node_modules/vega/index.js'),
      d3: path.resolve(__dirname, 'node_modules/d3/d3.min.js')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      vg: 'vega'
    }),

    new CleanPlugin([
      './build/*'
    ]),

    new HtmlPlugin({
      title: 'Candela Demo',
      filename: 'demo/index.html',
      chunks: ['demo']
    }),

    new HtmlPlugin({
      title: 'Resize Test',
      filename: 'resize/index.html',
      chunks: ['resize']
    }),

    new HtmlPlugin({
      title: 'Candela Examples',
      filename: 'examples/index.html',
      chunks: ['examples']
    }),

    new CopyPlugin([{
      from: 'app/examples/data/nba-heatmaps',
      to: 'examples/nba-heatmaps'
    }])
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'semistandard-loader',
        include: [
          path.resolve(__dirname, 'src/candela'),
          path.resolve(__dirname, 'src/vcharts'),
          path.resolve(__dirname, 'app')
        ],
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
        include: [
          __dirname + '/src',
          __dirname + '/app'
        ]
      },
      {
        test: function (path) {
          return path.endsWith('/src/external/pc.js');
        },
        loader: 'legacy-loader'
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.woff$|\.wav$|\.mp3$|\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$|\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader'
      },
      {
        test: /\.csv$/,
        loader: 'raw-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader?attrs=img:src'
      },
      {
        test: /\.styl$/,
        loaders: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.jade$/,
        loaders: ['jade-loader']
      },
      {
        test: /\.json$/,
        loaders: ['json-loader', 'strip-json-comments-loader']
      }
    ]
  }
};
