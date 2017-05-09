var webpack = require('webpack');

var config = require('./webpack.config');

config.entry = {
  'tests.bundle': './tests.bundle.js'
};

// config.devtool = 'inline-source-map';

// config.node = {
  // fs: 'empty'
// };

config.module.rules.forEach(function (rule) {
  var ident = rule.use && rule.use[0] && rule.use[0].options && rule.use[0].options.ident;

  if (rule.loader !== 'babel-loader' && ident !== 'glo') {
    delete rule.include;
  }
});

delete config.plugins;

module.exports = config;
