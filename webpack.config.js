var webpack = require('webpack');
var path = require('path');
var argv = require('yargs').argv;
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

var config = {
    name: 'index',
    src: './index.js',
    out: '',
    mainEntry: './src/index.js',
    plugins: []
};


var out,
    outfile = { prod: './dist', dev: './dist', example : './example' };

if (argv.build === "prod")
{
    config.out = outfile.dev;
    out = config.name.toLowerCase() + '.js';
}
else if (argv.build === "example")
{
    config.mainEntry = './example/app.js';
    config.plugins.push( new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        server: { baseDir: ['example'] }
    }));
    config.out = outfile.example;
    out = 'bundle.js';
}
else
{
    config.out = outfile.prod;
    out = config.name.toLowerCase() + '.js';
}


module.exports = {

    entry: config.mainEntry,

    devtool: 'source-map',

    output: {

        path: path.resolve(config.out),

        filename: out,

        library: config.name,

        libraryTarget: 'umd',

        umdNamedDefine: true

    },

    resolve: {

        root: path.resolve(config.src),

        extensions: ['', '.js']

    },

    plugins: config.plugins,

    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader' }
        ]
    }

};