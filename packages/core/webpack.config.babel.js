import path from 'path';

export default {
  entry: './src/VisComponent.js',
  output: {
    path: path.resolve('dist'),
    filename: 'candela-core.js'
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
