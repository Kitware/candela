import path from 'path';

export default {
  entry: './src/index.js',
  output: {
    libraryTarget: 'umd',
    path: path.resolve('dist'),
    filename: 'candela-geojs.js'
  },
  externals: {
    d3: 'd3'
  },
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
}
