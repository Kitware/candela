var config = require('./webpack-testing.config');

config.module.preLoaders.push({
  test: /\.js$/,
  include: /src/,
  exclude: /(src\/external|node_modules|\/test\/)/,
  loader: 'babel-istanbul'
});
