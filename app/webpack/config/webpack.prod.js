const merge = require('webpack-merge');
const path = require('path');
const { sep } = path;
const webpackBaseConfig = require('./webpack.base');
const HappyPack = require('happypack');
const os = require('os');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

// 多线程 build 配置
const happyPackConfig = {
    debug: true,
    threadPool: HappyPack.ThreadPool({ size: os.cpus().length })
};

module.exports = merge.smart(webpackBaseConfig, {
    mode: 'production',
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.join(process.cwd(), './app/public/dist/prod/'),
        publicPath: '/dist/prod/',
        crossOriginLoading: 'anonymous' // 允许跨域
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, `${require.resolve('happypack/loader')}?id=css`]
        }, {
            test: /\.js$/,
            include: [
                // 处理 elpis pages目录
                path.resolve(__dirname, `..${sep}..${sep}/pages`),
                // 处理 business pages目录
                path.resolve(process.cwd(), './app/pages')
            ],
            use: [`${require.resolve('happypack/loader')}?id=js`]
        }]
    },
    // webpack 不会有大量 hints 信息
    performance: {
        hints: false //
    },
    plugins: [
        // 每次打包前清空 dist prod 文件夹
        new CleanWebpackPlugin(['public/dist'], {
            root: path.resolve(process.cwd(), './app/'),
            verbose: true,
            exclude: []
        }),
        // 提取 CSS 公共部分，有效利用缓存
        new MiniCssExtractPlugin({
            chunkFilename: 'css/[name]_[contenthash:8].bundle.css'
        }),
        // 优化并压缩 CSS 资源
        new CssMinimizerPlugin(),
        // 多线程加快打包 JS 资源
        new HappyPack({
            ...happyPackConfig,
            id: 'js',
            loaders: [`${require.resolve('babel-loader')}?${JSON.stringify({
                presets: [require.resolve('@babel/preset-env')],
                plugins: [
                    require.resolve('@babel/plugin-transform-runtime')
                ]
            })}`]
        }),
        // 多线程加快打包 CSS 资源
        new HappyPack({
            ...happyPackConfig,
            id: 'css',
            loaders: [{
                path: require.resolve('css-loader'),
                options: {
                    importLoaders: 1
                }
            }]
        }),
        // 浏览器在请求资源时不发送用户的身份凭证
        new HtmlWebpackInjectAttributesPlugin({
            crossOrigin: 'anonymous'
        })
    ],
    optimization: {
        // 使用 TerserWebpackPlugin 的并发和缓存，提升压缩阶段的性能
        // 清楚 console.log
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                cache: true, // 启用缓存来加速构建
                parallel: true, // 利用多核 CPU 的优势加速压缩
                terserOptions: {
                    compress: {
                        drop_console: true // 移除 console
                    }
                }
            })
        ]
    }
});