var webpack = require('webpack');
var path = require('path');

var CleanPlugin = require('clean-webpack-plugin');

__dirname = path.resolve(__dirname, '..');

var includePaths = [
  __dirname + '/app',
  __dirname + '/index.js',
  __dirname + '/components',
  __dirname + '/test',
  __dirname + '/util',
  __dirname + '/VisComponent'
];

function addNMPath(package, paths) {
  return [new RegExp('/node_modules/' + package + '/')].concat(paths);
}

module.exports = {
  devtool: 'source-map',
  __dirname: __dirname,
  entry: {
    candela: './index.js',
  },
  output: {
    library: '[name]',
    libraryTarget: 'umd',
    path: 'build',
    filename: '[name]/[name].js'
  },
  plugins: [
    new CleanPlugin([path.resolve(__dirname, 'build/candela')], {
      root: __dirname
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        },
        include: includePaths
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.woff$|\.wav$|\.mp3$|\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$|\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        include: addNMPath('font-awesome', includePaths)
      },
      {
        test: /\.csv$/,
        loader: 'raw-loader',
        include: includePaths
      },
      {
        test: /\.html$/,
        loader: 'html-loader?attrs=img:src',
        include: includePaths
      },
      {
        test: /\.styl$/,
        loaders: ['style-loader', 'css-loader', 'stylus-loader'],
        include: includePaths
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        include: addNMPath('LineUpJS', includePaths)
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        include: addNMPath('UpSet', includePaths)
      },
      {
        test: /\.jade$/,
        loaders: ['jade-loader'],
        include: includePaths
      },
      {
        test: /\.json$/,
        loaders: ['json-loader', 'strip-json-comments-loader'],
        include: addNMPath('datalib', includePaths)
      }
    ]
  }
};
