var path = require('path');

function _includePaths (basePath) {
  if (basePath) {
    return [
      basePath + '/app',
      basePath + '/index.js',
      basePath + '/components',
      basePath + '/shim',
      basePath + '/test',
      basePath + '/util',
      basePath + '/VisComponent'
    ];
  } else {
    return [
      /\/node_modules\/candela\//
    ]
  }
}

function addNMPath(packages, paths) {
  if (!Array.isArray(packages)) {
    packages = [packages];
  }

  return packages.map(function (package) {
    return new RegExp('/node_modules/' + package + '/')
  }).concat(paths);
}

module.exports = function (config, basePath) {
  var includePaths = _includePaths(basePath);

  // Install empty module and module.loaders entries if missing.
  config.module = config.module || {};
  config.module.loaders = config.module.loaders || [];

  // Prepend the Candela loaders.
  config.module.loaders = [
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
      include: addNMPath(['font-awesome', 'bootstrap'], includePaths)
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
      include: addNMPath('lineupjs', includePaths)
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
  ].concat(config.module.loaders);

  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};
  config.resolve.alias['font-awesome-webpack$'] = path.resolve(basePath || '.', 'shim', 'font-awesome-webpack.shim.js');

  return config;
};
