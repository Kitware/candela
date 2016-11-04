var path = require('path');
var fs = require('fs');

var webpack = require('webpack');

var helper = function (config, data) {
  var pluginPath = function (relpath) {
    return path.resolve(data.pluginDir, relpath);
  };

  var entry = [];
  var gaKey = process.env.GOOGLE_ANALYTICS_KEY;
  if (gaKey) {
    var gaTemplate = fs.readFileSync(pluginPath('gaTemplate.js'), {
      encoding: 'utf-8'
    });

    var gaText = gaTemplate.replace('${GOOGLE_ANALYTICS_KEY}', gaKey);
    var gaPath = pluginPath('ga.js');
    fs.writeFileSync(gaPath, gaText);

    config.entry[data.pluginEntry].push(gaPath);
  }

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      vg: 'vega'
    }),
    new webpack.NormalModuleReplacementPlugin(/font-awesome-webpack/, require.resolve(path.resolve(data.pluginDir, 'font-awesome-webpack-shim.js')))
  ]);

  var pluginSourceDir = path.resolve(data.pluginDir, 'web_external');

  config.module = config.module || {};
  config.module.loaders = [
    {
      test: /\.jpe?g$|\.gif$|\.png$|\.woff$|\.wav$|\.mp3$|\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$|\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      include: [
        pluginSourceDir,
        /candela\/app\/resonantlab\/web_external/,
        /node_modules/,
        /node_modules_resonantlab/,
        /src\/candela/
      ],
      loader: 'url-loader'
    },
    {
      test: /\.scss$/,
      include: [
        pluginSourceDir,
        data.nodeDir,
        /candela\/app\/resonantlab\/web_external/
      ],
      loaders: ['style-loader', 'css-loader', 'sass-loader']
    },
    {
      test: /\.styl$/,
      include: [
        pluginSourceDir,
        /app\/resonantlab\/web_external/,
        /src\/candela/
      ],
      loaders: ['style-loader', 'css-loader', 'stylus-loader']
    },
    {
      test: /\.css$/,
      include: [
        pluginSourceDir,
        /candela\/app\/resonantlab\/web_external/
      ],
      loader: 'style-loader!css-loader'
    },
    {
      test: /\.html$/,
      include: [
        pluginSourceDir,
        /src\/candela/,
        /candela\/app\/resonantlab\/web_external/
      ],
      loader: 'html-loader?attrs=img:src image:xlink:href'
    },
    {
      test: /\.pegjs$/,
      include: [
        pluginSourceDir,
        /candela\/app\/resonantlab\/web_external/
      ],
      loader: 'pegjs-loader'
    },
    {
      test: /\.json$/,
      include: [
        pluginSourceDir,
        data.nodeDir,
        /candela\/app\/resonantlab\/web_external/
      ],
      loaders: ['json-loader', 'strip-json-comments-loader']
    },
    {
      test: /\.jade$/,
      include: [
        pluginSourceDir,
        /candela\/app\/resonantlab\/web_external/
      ],
      loaders: ['jade-loader']
    },
    {
      test: /general_purpose\/.*\.js$/,
      include: [
        pluginSourceDir,
        /candela\/app\/resonantlab\/web_external/
      ],
      exclude: [
        /node_modules/,
        /node_modules_resonantlab/
      ],
      loader: 'exports-loader?es6exports'
    },
    {
      test: /\.js$/,
      include: [
        pluginSourceDir,
        /candela\/app\/resonantlab\/web_external/
      ],
      exclude: [
        /node_modules/,
        /node_modules_resonantlab/,
        /general_purpose/,
        /build/
      ],
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }
  ].concat(config.module.loaders);

  return config;
};

module.exports = helper;
