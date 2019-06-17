import path from 'path';

export default {
  entry: './src/index.js',
  output: {
    libraryTarget: 'umd',
    path: path.resolve('dist'),
    filename: 'candela-d3chart.js'
  },
  externals: [
    '@candela/core',
    '@candela/events',
    '@candela/size',
    'd3-selection',
    'd3-transition'
  ],
  module: {
    rules: [
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
  }
};
