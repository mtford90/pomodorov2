var path = require('path');

module.exports = {
    module: {

        output: 'testBundle.js',

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

};