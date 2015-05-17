module.exports = {
    entry: './js/demo/entry.js',

    output: {
        path: './assets/built',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.js$/, loader: 'babel-loader', exclude: /three\.min\.js/ },
            { test: /\.purs$/, loader: 'purs-loader?output=purs_output&src[]=purs' }
        ]
    }
};
