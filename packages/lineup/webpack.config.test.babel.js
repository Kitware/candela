import path from 'path';

import moduleConfig from './webpack.config.babel';

let config = {
  entry: './tests.js',
  output: {
    path: path.resolve('build'),
    filename: 'test.unit.js'
  },
  module: moduleConfig.module,
  node: {
    fs: 'empty'
  }
};

if (process.env.COVERAGE) {
  config.devtool = 'cheap-module-source-map';
  config.output.filename = 'test.coverage.js';
  config.module = {
    rules: [
      {
        enforce: 'post',
        test: /\.js$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: {
            esModules: true
          }
        },
        include: [
          path.resolve('src/')
        ],
        exclude: /\.spec\.js$/
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  };
}

export default config;
