/*globals require, module*/
module.exports = {
    entry: './mainPage.js',
    output: {
        path: 'web_client/extra',
        filename: 'webpack_bundle.js'
    },
    plugins: [],
    debug : true,
    devtool : 'cheap-source-map',
    module : {
        loaders : [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.html$/,
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
