const glob = require('glob');
const path = require('path');
const { sep } = path;

/**
 *
 * @param Koa实例 app
 *
 * 加载所有 service，可通过'app.service.${目录}.${文件名}' 访问
 * 例子：
 *    app/service
 *       |
 *       |-- custom-module
 *           |
 *           |--custom-service.js
 *     => app.service.customModule.customController
 */
module.exports = (app) => {
    let service = {};

    // 读取 elpis/app/service/**/*.js 下所有文件
    const elpisServicePath = path.resolve(__dirname, `..${sep}..${sep}app${sep}service`);
    const elpisFileList = glob.sync(path.resolve(elpisServicePath, `.${sep}**${sep}**.js`));
    elpisFileList.forEach(handleFile);

    // 读取 elpis/app/service/**/*.js 下所有文件
    const businessServicePath = path.resolve(app.businessDir, `.${sep}service`);
    const businessFileList = glob.sync(path.resolve(businessServicePath, `.${sep}**${sep}**.js`));
    businessFileList.forEach(handleFile);

    // 遍历所有文件目录，将内容加载到app.service
    function handleFile(file) {
        // 提取文件名称
        let name = path.resolve(file);

        // 截取文件路径 app/service/custom-module/custom-service.js => custom-module/custom-service.js
        name = name.substring(name.indexOf(`service${sep}`) + `service${sep}`.length, name.lastIndexOf('.'));
        // -替换为驼峰式写法  custom-module/custom-service => customModule/customController
        name = name.replace(/[_-][a-z]/ig, s => s.substring(1).toUpperCase());

        // 将 service 挂载到内存app上
        let tempService = service; // 初始化贡献内存地址
        const names = name.split(sep);
        for (let i = 0, len = names.length; i < len; i++) {
            if (i === len - 1) {
                const ServiceModule = require(path.resolve(file))(app);
                tempService[names[i]] = new ServiceModule();
            } else {
                if (!tempService[names[i]]) {
                    tempService[names[i]] = {};
                }

                tempService = tempService[names[i]];
            }
        }
    }

    app.service = service;
};