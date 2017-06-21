'use strict';

var path = require('path'),
    webpack = require('webpack'),
    env = require('../common/env'),
    entry = env.getParam('entry'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ProgressBarPlugin = require('progress-bar-webpack-plugin'),
    dir = env.getParam('workDir');
entry.push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000');
module.exports = {
    devtool: env.getParam('sourceMap'),
    context: dir,
    entry: {
        bundle: entry,
        vendor: env.getParam('vendor')
    },
    output: {
        path: path.resolve(dir, env.getParam('outPath')),
        filename: env.getParam('fileName'),
        chunkFilename: env.getParam('chunkFileName'),
        publicPath: env.getParam('publicPath')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'stage-0', 'react', 'react-hmre'],
                    plugins: ['transform-runtime', 'add-module-exports'],
                    cacheDirectory: true
                }
            }]
        }, {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader?' + env.getParam('cssLoadRule'), {
                loader: 'postcss-loader',
                options: {
                    plugins: function plugins() {
                        return [require('autoprefixer')()];
                    }
                }
            }, 'sass-loader']
        }, {
            test: /\.(png|jpg|svg)$/,
            use: ['url-loader?limit=25000']
        }, {
            test: /\.json$/,
            use: ['json-loader']
        }, {
            test: /\.html$/,
            use: ['html-loader?minimize=false']
        }]
    },
    plugins: [new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'],
        filename: env.getParam('chunkFileName').replace('chunkhash', 'hash'), //开启webpack-dev-server后无法使用chunkHash
        children: true
    }), new webpack.HotModuleReplacementPlugin(), new HtmlWebpackPlugin({
        filename: path.resolve(dir, env.getParam('htmlFilePath')),
        template: path.resolve(dir, env.getParam('htmlTemplatePath'))
    }), new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        __RunMode: JSON.stringify(env.getParam('runMode')),
        __Local: env.getParam('localRun') //本地模式
    }), new ProgressBarPlugin({ summary: false })]
};