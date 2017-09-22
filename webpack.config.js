const path = require('path');

const APP_DIR = path.join(__dirname, 'src');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/bundles')
    },
    module: {
        loaders: [
            {
                test: /\.js/,
                include: APP_DIR,
                loader: 'babel-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
}