const path = require('path');
const { sep } = path;

module.exports = (app) => {
    // 读取 default config

    // 读取 elpis config 文件夹
    const elpisconfigPath = path.resolve(__dirname, `..${sep}..${sep}config`);
    let defaultConfig = require(path.resolve(elpisconfigPath, `.${sep}config.default.js`));

    // 读取 业务 config 文件夹
    const businessConfigFilePath = path.resolve(app.baseDir, `.${sep}config`);
    try {
        defaultConfig = {
            ...defaultConfig,
            ...require(path.resolve(businessConfigFilePath, `.${sep}config.default.js`))
        };
    } catch (e) {
        console.error('[exception] there is no default config file');
    }

    // 读取 env config
    let envConfig = {};
    try {
        if (app.env.isLocal()) { // 本地环境
            envConfig = require(path.resolve(businessConfigFilePath, `.${sep}config.local.js`));
        } else if (app.env.isBelta()) { // 测试环境
            envConfig = require(path.resolve(businessConfigFilePath, `.${sep}config.belta.js`));
        } else if (app.env.isProduction()) { // 生产环境
            envConfig = require(path.resolve(businessConfigFilePath, `.${sep}config.prod.js`));
        }
    } catch (e) {
        console.error('[exception] there is no env config file');
    }

    // 合并 config 并加载
    app.config = Object.assign({}, defaultConfig, envConfig);
};