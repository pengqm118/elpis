// 本地开发启动 devServer
const path = require('path');
const webpack = require('webpack');
const express = require('express');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

module.exports = () => {
    // 读取 webpack 和 devServer 配置
    const {
        webpackConfig,
        devServerConfig
    } = require('./config/webpack.dev.js');

    const app = express();
    const compiler = webpack(webpackConfig);

    // 制定静态文件目录
    app.use(express.static(path.join(__dirname, '../public/dist')));

    // 引入 devMiddleware 中间件(监听文件改动)
    app.use(devMiddleware(compiler, {
        // 落地文件(即保存到具体的磁盘，tpl 文件需要保存到某个目录下，后面被 middlewares 中间件 renderPage)
        writeToDisk: filePath => filePath.endsWith('.tpl'),
        // 资源路径
        publicPath: webpackConfig.output.publicPath,
        // headers 设置
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS, PATCH, DELETE',
            'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization, Accept'
        },
        stats: {
            colors: true
        }
    }));

    // 引入 hotMiddleware 中间件(实现热更新通讯)
    app.use(hotMiddleware(compiler, {
        path: `/${devServerConfig.HMR_PATH}`,
        log: () => {}
    }));

    const port = devServerConfig.PORT;
    app.listen(port, () => {
        console.log(`app listening on port ${port}`);
    });
}
