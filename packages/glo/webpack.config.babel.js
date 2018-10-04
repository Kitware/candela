import path from 'path';

export default {
  entry: './src/index.js',
  output: {
    libraryTarget: 'umd',
    path: path.resolve('dist'),
    filename: 'candela-glo.js'
  },
  externals: [
    '@candela/core',
    'd3',
    'underscore'
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
      },
      {
        test: () => true,
        include: path.resolve('./node_modules/glo/glo.js'),
        use: [
          'exports-loader?GLO',
          'imports-loader?_=underscore'
        ]
      }
    ]
  }
};
