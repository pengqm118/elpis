const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

// 基础配置
const webpackBaseConfig = require('./webpack.base');

// devServer 配置
const devServerConfig = {
    HOST: '127.0.0.1',
    PORT: 7777,
    HMR_PATH: '__webpack_hmr',
    TIMEOUT: 2000
};

// 开发阶段的 entry 配置需加上 hmr 配置
const { HOST, PORT, HMR_PATH, TIMEOUT } = devServerConfig;
Object.keys(webpackBaseConfig.entry).forEach((v) => {
    // 第三方文件包不作为 hmr 入口
    if (v !== 'vendor') {
        webpackBaseConfig.entry[v] = [
            // 主入口文件
            webpackBaseConfig.entry[v],
            // hmr 更新入口
            `${require.resolve('webpack-hot-middleware/client')}?path=http://${HOST}:${PORT}/${HMR_PATH}&timeout=${TIMEOUT}&reload=true`
        ];
    }
});

// 开发环境 webpack 配置
const webpackConfig = merge.smart(webpackBaseConfig, {
    mode: 'development',
    // source-map
    devtool: 'eval-cheap-module-source-map',
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.resolve(process.cwd(), './app/public/dist/dev/'), // 文件生成位置
        publicPath: `http://${HOST}:${PORT}/public/dist/dev`, // 外部资源公共路径
        globalObject: 'this'
    },
    plugins: [
        // 热模块更新允许程序在运行时进行更新
        new webpack.HotModuleReplacementPlugin({
            multiStep: false
        })
    ]
});

module.exports = {
    // webpack 配置
    webpackConfig,
    // devServe 配置
    devServerConfig
};