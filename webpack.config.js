var path = require('path');

var candelaWebpack = require('./webpack');

var externals = {};
var external_packages = [
  'candela',
  'candela/VisComponent',
  'candela/util',
  'candela/plugins/mixin/Events',
  'candela/plugins/mixin/VegaChart',
  'css-loader',
  'crypt',
  'd3',
  'd3-array',
  'd3-color',
  'd3-dispatch',
  'd3-ease',
  'd3-interpolate',
  'd3-scale',
  'd3-selection',
  'd3-timer',
  'd3-transition',
  'd3-shape',
  'datalib',
  'font-awesome-webpack',
  'geojs',
  'glo',
  'jade-loader',
  'javascript-detect-element-resize/detect-element-resize',
  'jquery',
  'lineupjs',
  'lineupjs/build/style.css',
  'md5',
  'nvd3',
  'onset',
  'sententree',
  'style-loader',
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
    candela: './index.js'
  },
  output: {
    library: 'candela',
    libraryTarget: 'umd',
    path: 'dist',
    filename: process.env.CANDELA_MINIFY ? '[name].min.js' : '[name].js'
  },
  externals: externals
};

var plugins = [
  'geojs',
  'glo',
  'lineup',
  'mixin',
  'onset',
  'sententree',
  'similaritygraph',
  'trackerdash',
  'treeheatmap',
  'upset',
  'vega'
];
plugins.forEach(p => config.entry[p] = `./plugins/${p}/index.js`);

module.exports = candelaWebpack(config, path.resolve('.'));
