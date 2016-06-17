var webpack = require('webpack');
var path = require('path');

var CleanPlugin = require('clean-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');

__dirname = path.resolve(__dirname, '..');

var examples = require('../app/examples/index.json');

// Compute entry points for the examples.
var entryPoints = examples.map(function (ex) {
  return {
    key: 'examples/' + ex.link,
    value: './app/examples/' + ex.link + '/index.js'
  };
});

var entry = {
  candela: ['./src/candela/index.js'],
  examples: './app/examples/index.js'
};

entryPoints.forEach(function (ep) {
  entry[ep.key] = ep.value;
});

// Compute HTML file stubs for the examples.
var htmlPlugins = examples.map(function (ex) {
  return new HtmlPlugin({
    title: ex.title,
    filename: 'examples/' + ex.link + '/index.html',
    chunks: ['examples/' + ex.link]
  });
});

var plugins = [
  new webpack.ProvidePlugin({
    vg: 'vega'
  }),

  new CleanPlugin([path.resolve(__dirname, 'build/*')], {
    root: __dirname
  }),

  new HtmlPlugin({
    title: 'Candela Examples',
    filename: 'examples/index.html',
    chunks: ['examples']
  }),

  new CopyPlugin([{
    from: 'app/examples/data/nba-heatmaps',
    to: 'examples/parallel-coords/nba-heatmaps'
  }])
];

htmlPlugins.forEach(function (hp) {
  plugins.push(hp);
});

module.exports = {
  devtool: 'source-map',
  __dirname: __dirname,
  entry: entry,
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
  plugins: plugins,
  module: {
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
