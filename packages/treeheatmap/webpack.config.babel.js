import path from 'path';

export default {
  entry: './src/index.js',
  output: {
    libraryTarget: 'umd',
    path: path.resolve('dist'),
    filename: 'candela-treeheatmap.js'
  },
  externals: [
    '@candela/core',
    'd3-array',
    'd3-scale',
    'd3-selection',
    'd3-shape',
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
              ['@babel/env', {
                targets: {
                  node: 'current'
                }
              }]
            ]
          }
        }
      }
    ]
  }
};
