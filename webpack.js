function _includePaths (basePath) {
  if (basePath) {
    return [
      basePath + '/app',
      basePath + '/candela.js',
      basePath + '/components',
      basePath + '/shim',
      basePath + '/test',
      basePath + '/util',
      basePath + '/VisComponent'
    ];
  } else {
    return [
      /\/node_modules\/candela\//
    ];
  }
}

function addNMPath (packages, paths) {
  if (!Array.isArray(packages)) {
    packages = [packages];
  }

  return packages.map(function (pkg) {
    return new RegExp('/node_modules/' + pkg + '/');
  }).concat(paths);
}

module.exports = function (config, basePath, options) {
  var includePaths = _includePaths(basePath);

  options = options || {};

  // By default, exclude the existing loaders from affecting
  // node_modules/candela. This prevents double application of loaders if they
  // are specified in the client project without any include or exclude
  // directives.
  var exclude = options.excludeCandelaNM === undefined || options.excludeCandelaNM;

  // Exclude the base paths from having existing loaders applied to them.
  if (exclude) {
    // Install empty module and module.loaders entries if missing.
    config.module = config.module || {};
    config.module.loaders = config.module.loaders || [];

    // For each loader, append the Candela include paths to its `exclude`
    // property.
    config.module.loaders.forEach(function (loader) {
      // Install an empty list if there is no `exclude` property.
      loader.exclude = loader.exclude || [];

      // If the `exclude` propertry is a non-list singleton, wrap it in a list.
      if (!Array.isArray(loader.exclude)) {
        loader.exclude = [loader.exclude];
      }

      loader.exclude = loader.exclude.concat(includePaths);
    });
  }

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

  return config;
};
