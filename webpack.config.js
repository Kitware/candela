var webpack = require('webpack');
var path = require('path');

var CleanPlugin = require('clean-webpack-plugin');

var production = process.env.NODE_ENV === 'production';

var plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'main',
    children: true,
    minChunks: 2
  }),

  new CleanPlugin(['./dist/resplendent.js', './dist/main.js', './dist/index.js'])
];

if (production) {
  plugins = plugins.concat([
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 51200,
      }),
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        compress: {
          warnings: false
        }
      }),
      new webpack.DefinePlugin({
        __SERVER__: !production,
        __DEVELOPMENT__: !production,
        __DEVTOOLS__: !production,
        'process.env': {
          BABEL_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      })
  ]);
}

module.exports = {
  debug: !production,
  devtool: production ? false : 'eval',
  entry: {
    resplendent: ['./src/resplendent.js'],
    index: './src/index.js'
  },
  output: {
    library: '[name]',
    libraryTarget: 'umd',
    path: 'dist',
    filename: '[name].js',
  },
  plugins: plugins,
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'semistandard',
        include: path.resolve(__dirname, 'src')
      }
    ],
    loaders: [
      {
        test: /\.js/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        },
        include: __dirname + '/src'
      },
      {
        test: /\.styl/,
        loaders: ['style', 'css', 'stylus']
      },
      {
        test: /\.jade/,
        loaders: ['html', 'jade']
      }
    ]
  }
};
