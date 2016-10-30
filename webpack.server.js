var nodeExternals = require('webpack-node-externals');
var path = require('path');
module.exports = {
    entry: {
        "main.js": "./src/main.ts",//electron default entry index.js if no package.json
        "WebServer.js": "./src/WebServer.ts"
    },
    target: "electron",
    externals: [nodeExternals(
        {
            // this WILL include `jquery` and `webpack/hot/dev-server` in the bundle, as well as `lodash/*`
            whitelist: [
                'express',
                'accepts',
                'mime-types',
                'mime-db',
                'negotiator',
                'array-flatten',
                'content-disposition',
                'content-type',
                'cookie',
                'cookie-signature',
                'debug',
                'ms',
                'depd',
                'encodeurl',
                'escape-html',
                'etag',
                'finalhandler',
                'statuses',
                'unpipe',
                'fresh',
                'merge-descriptors',
                'methods',
                'on-finished',
                'ee-first',
                'parseurl',
                'path-to-regexp',
                'proxy-addr',
                'forwarded',
                'ipaddr.js',
                'qs',
                'range-parser',
                'send',
                'destroy',
                'http-errors',
                'inherits',
                'setprototypeof',
                'mime',
                'serve-static',
                'type-is',
                'media-typer',
                'utils-merge',
                'vary',


                'body-parser',
                'bytes',
                'content-type',
                'debug',
                'ms',
                'depd',
                'http-errors',
                'setprototypeof',
                'statuses',
                'iconv-lite',
                'on-finished',
                'ee-first',
                'qs',
                'raw-body',
                'unpipe',
                'type-is',
                'media-typer',
                'mime-types',
                'mime-db',


                'mustache-express',
                'mustache',
                'lru-cache',
                'async',


                'nedb',
                'socket.io',
                'unirest',
                /^lodash/]
        }
    )],
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
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};