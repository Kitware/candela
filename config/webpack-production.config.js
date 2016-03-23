var config = require('./webpack.config');

delete config.devtool;

config.entry = {
  candela: './src/candela/index.js'
};

config.output = {
  library: 'candela',
  libraryTarget: 'umd',
  path: 'dist',
  filename: 'candela.js'
};

config.plugins = [
  config.plugins[0]
];

delete config.module.preLoaders;

module.exports = config;
