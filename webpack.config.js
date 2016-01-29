var webpack = require('webpack');
var production = process.env.NODE_ENV === 'production';

var plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'main',
    children: true,
    minChunks: 2
  })
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
  entry: './src',
  output: {
    path: 'dist',
    filename: 'resplendent.js',
    libraryTarget: 'umd',
    publicPath: 'dist/'
  },
  plugins: plugins,
  module: {
    preLoaders: [
      test: /\.js$/,
      loader: 'semistandard',
      exclude: 'node_modules'
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
