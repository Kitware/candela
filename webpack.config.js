var webpack = require('webpack');
var path = require('path');

var CleanPlugin = require('clean-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    candela: ['./src/index.js'],
    demo: './app/demo/index.js',
    resize: './app/resize/index.js'
  },
  output: {
    library: '[name]',
    libraryTarget: 'umd',
    path: 'dist',
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
      './dist'
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
    })
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'semistandard',
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'app')
        ],
        exclude: path.resolve(__dirname, 'src', 'external')
      }
    ],
    loaders: [
      {
        test: require.resolve('./src/index.js'),
        loader: 'expose?candela'
      },
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
