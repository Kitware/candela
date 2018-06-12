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
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/env'
            ]
          }
        }
      }
    ]
  };
}

export default config;
