var config = require('./webpack-testing.config');

config.module.preLoaders = [
  {
    test: /\.js$/,
    include: /src/,
    exclude: /(external|node_modules|test)/,
    loader: 'babel-istanbul-loader',
    query: {
      presets: ['es2015']
    }
  }
];

module.exports = config;
