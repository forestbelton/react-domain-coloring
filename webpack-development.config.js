module.exports = {
    entry: {
        app: ['webpack/hot/dev-server', './js/demo/entry.js'],
    },

    output: {
        path: './assets/built',
        publicPath: '/built',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.js$/, loader: 'babel-loader', exclude: /three\.min\.js/ },
            { test: /\.purs$/, loader: 'purs-loader?noPrelude&output=purs_output&src[]=purs' }
        ]
    },

    resolve: {
        modulesDirectories: ['node_modules', 'purs_output']
    }
};
