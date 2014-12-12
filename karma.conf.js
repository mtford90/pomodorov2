// Karma configuration

var path = require('path');

module.exports = function (config) {
    config.set({
        // ... normal karma configuration

        basePath: '.',

        files: [
            'tests/test.js'
            // each file acts as entry point for the webpack configuration
        ],

        frameworks: ['mocha', 'chai'],


        preprocessors: {
            // add webpack as preprocessor
            'tests/test.js': ['browserify']
        },

        browserify: {
            debug: true,
            transform: [ 'brfs' ]
        },

        webpack: {
            module: {

                loaders: [
                    {
                        test: /\.jsx$/,
                        loaders: ['react-hot', 'jsx']
                    },
                    {
                        test: /\.scss$/,
                        loader: "style!css!sass?outputStyle=expanded"
                    },
                    {
                        test: /\.sass$/,
                        loader: "style!css!sass?outputStyle=expanded"
                    },
                    {
                        test: /\.css$/,
                        loader: "style-loader!css-loader!autoprefixer-loader"
                    },
                    {
                        test: /\.less$/,
                        loader: "style-loader!css-loader!less-loader"
                    },
                    {
                        test: /\.woff$/,
                        loader: "url-loader?limit=10000&minetype=application/font-woff"
                    },
                    {
                        test: /\.ttf$/,
                        loader: "file-loader"
                    },
                    {
                        test: /\.eot$/,
                        loader: "file-loader"
                    },
                    {
                        test: /\.svg$/,
                        loader: "file-loader"
                    },
                    {
                        test: /\.spec.js$/,
                        loader: "mocha-loader"
                    }
                ]
            },
            resolve: {
                root: [
                    path.resolve('scripts')
                ],
                modulesDirectories: [
                    'node_modules'
                ],
                extensions: ['', '.js', '.json', '.jsx']
            }

        },

        webpackServer: {
            stats: {
                colors: true
            }
        },

        // the port used by the webpack-dev-server
        // defaults to "config.port" + 1
        webpackPort: 1234,

        plugins: [
            'karma-webpack',
            'karma-browserify',
            'karma-mocha',
            'karma-chai',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-sourcemap-loader'
        ],

        debug: false,
        stats: {
            colors: true,
            reasons: true
        },
        progress: true,
        colors: true,
        autoWatch: true,

        browsers: ['Chrome']


    });
};