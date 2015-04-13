module.exports = {
    entry: {
        app: ['webpack/hot/dev-server', './js/entry.js'],
    },

    output: {
        path: './assets/built',
        publicPath: '/built',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.js$/, loader: 'babel-loader', exclude: /three\.min\.js/ }
        ]
    }
};
