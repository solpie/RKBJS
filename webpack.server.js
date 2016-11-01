var nodeExternals = require('webpack-node-externals');
var path = require('path');
var mustacheArr = [
    'mustache-express',
    'mustache',
    'lru-cache',
    'async'
]
var bodyparserArr = [
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
    'mime-db'
];
var unirestArr = [
    'unirest',
    'form-data',
    'async',
    'combined-stream',
    'delayed-stream',
    'mime-types',
    'mime-db',
    'mime',
    'request',
    'aws-sign2',
    'aws4',
    'bl',
    'readable-stream',
    'readable-stream/duplex',
    'core-util-is',
    'inherits',
    'isarray',
    'process-nextick-args',
    'string_decoder',
    'util-deprecate',
    'caseless',
    'combined-stream',
    'delayed-stream',
    'extend',
    'forever-agent',
    'form-data',
    'async',
    'lodash',
    'combined-stream',
    'mime-types',
    'har-validator',
    'chalk',
    'ansi-styles',
    'escape-string-regexp',
    'has-ansi',
    'ansi-regex',
    'strip-ansi',
    'ansi-regex',
    'supports-color',
    'commander',
    'graceful-readlink',
    'is-my-json-valid',
    'generate-function',
    'generate-object-property',
    'is-property',
    'jsonpointer',
    'xtend',
    'pinkie-promise',
    'pinkie',
    'hawk',
    'boom',
    'hoek',
    'cryptiles',
    'boom',
    'hoek',
    'sntp',
    'hoek',
    'http-signature',
    'assert-plus',
    'jsprim',
    'extsprintf',
    'json-schema',
    'verror',
    'extsprintf',
    'sshpk',
    'asn1',
    'assert-plus',
    'bcrypt-pbkdf',
    'tweetnacl',
    'dashdash',
    'assert-plus',
    'ecc-jsbn',
    'jsbn',
    'getpass',
    'assert-plus',
    'jodid25519',
    'jsbn',
    'jsbn',
    'tweetnacl',
    'is-typedarray',
    'isstream',
    'json-stringify-safe',
    'mime-types',
    'mime-db',
    'node-uuid',
    'oauth-sign',
    'qs',
    'stringstream',
    'tough-cookie',
    'punycode',
    'tunnel-agent',
    'util-deprecate'
];
module.exports = {
    entry: {
        "main.js": "./src/main.ts",//electron default entry index.js if no package.json
        "WebServer.js": "./src/WebServer.ts"
    },
    target: "electron",
    externals: [nodeExternals({
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
            'vary'].concat(unirestArr).concat(mustacheArr).concat(bodyparserArr)
    })],
    output: {
        path: './RKB-win32-x64/resources/app',
        // path: './resources/app',
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