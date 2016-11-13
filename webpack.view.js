"use strict";
var webpack = require('webpack');
module.exports = {
    entry: {
        "view/admin": "./src/view/admin/index.ts",
        "view/panel": "./src/view/panel/index.ts"
    },
    output: {
        path: './resources/app/static',
        filename: "[name].js"
    },
    devtool: 'source-map',
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ],
        loaders: [
            {test: /\.tsx?$/, loader: "ts-loader"},
            {test: /\.html$/, loader: "html-loader?minimize=false"},
            {test: /\.css$/, loader: "style-loader!css-loader?root=."}
        ]
    },
    resolve: {
        extensions: ["", ".ts", ".tsx", ".html", ".js"]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
