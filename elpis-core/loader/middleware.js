const glob = require('glob');
const path = require('path');
const { sep } = path;

/**
 *
 * @param Koa实例 app
 *
 * 加载所有 middlewares，可通过'app.middlewares.${目录}.${文件名}' 访问
 * 例子：
 *    app/middlewares
 *       |
 *       |-- custom-module
 *           |
 *           |--custom-middlewares.js
 *     => app.middlewares.customModule.customMiddleware
 */
module.exports = (app) => {
    let middlewares = {};

    // 读取 elpis/app/middlewares/**/*.js 下所有文件
    const elpisMiddlewaresPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}middlewares`);
    const elpisFileList = glob.sync(path.resolve(elpisMiddlewaresPath, `.${sep}**${sep}**.js`));
    elpisFileList.forEach(handleFile);

    // 读取 业务/app/middlewares/**/*.js 下所有文件
    const businessMiddlewaresPath = path.resolve(app.businessDir, `.${sep}middlewares`);
    const businessFileList = glob.sync(path.resolve(businessMiddlewaresPath, `.${sep}**${sep}**.js`));
    businessFileList.forEach(handleFile);

    // 遍历所有文件目录，将内容加载到app.middlewares下
    function handleFile(file) {
        // 提取文件名称
        let name = path.resolve(file);

        // 截取文件路径 app/middlewares/custom-module/custom-middlewares.js => custom-module/custom-middlewares.js
        name = name.substring(name.indexOf(`middlewares${sep}`) + `middlewares${sep}`.length, name.lastIndexOf('.'));
        // -替换为驼峰式写法  custom-module/custom-middlewares => customModule/customMiddleware
        name = name.replace(/[_-][a-z]/ig, s => s.substring(1).toUpperCase());

        // 将middlewares 挂载到内存app上
        let tempMiddlewares = middlewares; // 初始化贡献内存地址
        const names = name.split(sep);
        for (let i = 0, len = names.length; i < len; i++) {
            if (i === len - 1) {
                tempMiddlewares[names[i]] = require(path.resolve(file))(app);
            } else {
                if (!tempMiddlewares[names[i]]) {
                    tempMiddlewares[names[i]] = {};
                }

                tempMiddlewares = tempMiddlewares[names[i]];
            }
        }
    }

    app.middlewares = middlewares;
};