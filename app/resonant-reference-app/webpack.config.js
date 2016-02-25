/*globals require, module*/
var CleanWebpackPlugin = require('clean-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './app.js',
    output: {
        path: '_build',
        filename: 'webpack_bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin(['_build'], {
            verbose: true
        }),
        new CopyWebpackPlugin([{ from: 'data', to: 'data' }])
    ],
    debug : true,
    devtool : 'cheap-source-map',
    module : {
        loaders : [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /index\.html/,
                loader: 'file?name=index.html'
            },
            {
                test: /^((?!index).)*\.html$/,
                loader: 'html?attrs=img:src'
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
                loader: "url"
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    }
};