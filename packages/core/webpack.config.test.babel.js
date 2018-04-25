import path from 'path';

import moduleConfig from './webpack.config.babel';

let config = {
  entry: './tests.js',
  output: {
    path: path.resolve('dist'),
    filename: 'test.unit.js'
  },
  module: moduleConfig.module,
  node: {
    fs: 'empty'
  }
};

export default config;
