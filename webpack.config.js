const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')


let mode = 'development'
if (process.env.NODE_ENV === 'production') {
    mode = 'production'
}

const plugins = [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        title: 'index',
        template: './src/index.html',
        chunks: ['main']
    }),
    new HtmlWebpackPlugin({
        filename: 'some.html',
        title: 'some',
        template: './src/some.html',
        chunks: ['test']
    }),
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
    })
]


if (process.env.SERVE) { // Используем плагин только если запускаем devServer
    plugins.push(new ReactRefreshWebpackPlugin())
}

module.exports = {
    mode,
    entry: {
        main: ["@babel/polyfill", './src/index.js'],
        test: './src/js/test.js'
    },
    devtool: 'source-map',
    plugins,
    module: {
        rules: [
            { test: /\.(html)$/, use: ['html-loader'] },
            {
                test: /\.(s[ac]|c)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/[hash][ext][query]'
                }
                // loader: 'file-loader',
                // options: {
                //     name: 'assets/[name].[ext]'
                // }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[ext][query]'
                }

            },
            {
                test: /\.js$/,
                exclude: /node_modules/, // не обрабатываем файлы из node_modules
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true, // Использование кэша для избежания рекомпиляции
                        // при каждом запуске
                    },
                },
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },

    target: 'web',

    devServer: {
        static: './dist',
        watchFiles: ["./src/*"],
        hot: true,
        historyApiFallback: true,
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
}