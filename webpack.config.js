var path = require('path');

var candelaWebpack = require('./webpack');

var externals = {};
var external_packages = [
  'crypt',
  'd3',
  'd3-array',
  'd3-scale',
  'd3-selection',
  'd3-shape',
  'datalib',
  'font-awesome-webpack',
  'geojs',
  'javascript-detect-element-resize/detect-element-resize',
  'jquery',
  'lineupjs',
  'lineupjs/build/style.css',
  'md5',
  'nvd3',
  'onset',
  'sententree',
  'telegraph-events',
  'underscore',
  'UpSet',
  'vega',
  'webcola'
].forEach(function (ext) {
  externals[ext] = true;
});

var config = {
  entry: {
    candela: './candela.js',
  },
  output: {
    library: 'candela',
    libraryTarget: 'umd',
    path: 'dist',
    filename: null
  },
  externals: externals
};

if (process.env.CANDELA_MINIFY) {
  config.output.filename = 'candela.min.js';
} else {
  config.output.filename = 'candela.js';
}

module.exports = candelaWebpack(config, path.resolve('.'));
