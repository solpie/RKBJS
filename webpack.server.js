var nodeExternals = require('webpack-node-externals');
var path = require('path');
module.exports = {
    entry: {
        "main.js": "./src/main.ts",//electron default entry index.js if no package.json
        "WebServer.js": "./src/WebServer.ts"
    },
    target: "electron",
    externals: [],
    output: {
        // path: './RKB-win32-x64/resources/app',
        path: './resources/app',
        filename: "[name]"
    },
    resolve: {
        extensions: ["", ".ts", ".tsx", ".js", '.html']
    },
    devtool: 'source-map',
    module: {
        preLoaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ],
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {test: /\.tsx?$/, exclude: [/node_modules/], loader: 'ts-loader'},
            {
                test: /\.json$/,
                loader: "json"
            },
            {test: /\.coffee$/, loader: "coffee-loader"},
            {test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate"},
            {test: /\.html$/, loader: "html-loader?minimize=false"}

        ]
    },
    plugins: [
        // new CopyWebpackPlugin([
        //     {
        //         context: 'src/',
        //         from: 'view/**/*.ejs'
        //     },
        //     {
        //         context: 'src/static/',
        //         from: '**/*', to: 'static/'
        //     },
        //     {from: 'src/package.json'},
        //     {from: 'src/utils/wcjs-player/index.js',to:'static/js/wcjs-player/'},
        //     {from: 'src/server.html'},
        //     {from: 'src/index.html'}
        // ])
    ]
};