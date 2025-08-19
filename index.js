// 引入 elpis-core
const elpis = require('./elpis-core');
// 引入 前端工程化构建方法
const FEBuildDev = require('./app/webpack/dev.js');
const FEBuildProd = require('./app/webpack/prod.js');

module.exports = {
    /**
     * 服务端基础
     */
    Controller: {
        base: require('./app/controller/base.js')
    },
    Service: {
        base: require('./app/service/base.js')
    },

    /**
     * 编辑构建前端工程
     * @param env 环境变量 local/production
     */
    frontendBuild(env) {
        if (env === 'local') {
            FEBuildDev();
        } else if (env === 'production') {
            FEBuildProd();
        }
    },
    /**
     * 启动 elpis 服务
     * @param option：服务配置参数， 透传到 elpis-core 内部
     */
    serverStart(option) {
        const app = elpis.start(option);
        return app;
    }
};