module.exports = {
    entry: './js/entry.js',

    output: {
        path: './assets/built',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.js$/, loader: 'babel-loader', exclude: /three\.min\.js/ }
        ]
    }
};
