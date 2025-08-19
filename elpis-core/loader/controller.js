const glob = require('glob');
const path = require('path');
const { sep } = path;

/**
 *
 * @param Koa实例 app
 *
 * 加载所有 controller，可通过'app.controller.${目录}.${文件名}' 访问
 * 例子：
 *    app/controller
 *       |
 *       |-- custom-module
 *           |
 *           |--custom-controller.js
 *     => app.controller.customModule.customController
 */
module.exports = (app) => {
    let controller = {};

    // 读取 elpis/app/controller/**/*.js 下所有文件
    const elpisControllerPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}controller`);
    const elpisFileList = glob.sync(path.resolve(elpisControllerPath, `.${sep}**${sep}**.js`));
    elpisFileList.forEach(handleFile);

    // 读取 业务/app/controller/**/*.js 下所有文件
    const businessControllerPath = path.resolve(app.businessDir, `.${sep}controller`);
    const businessFileList = glob.sync(path.resolve(businessControllerPath, `.${sep}**${sep}**.js`));
    businessFileList.forEach(handleFile);

    // 遍历所有文件目录，将内容加载到app.controller
    function handleFile(file) {
        // 提取文件名称
        let name = path.resolve(file);

        // 截取文件路径 app/controller/custom-module/custom-controller.js => custom-module/custom-controller.js
        name = name.substring(name.indexOf(`controller${sep}`) + `controller${sep}`.length, name.lastIndexOf('.'));
        // -替换为驼峰式写法  custom-module/custom-controller => customModule/customController
        name = name.replace(/[_-][a-z]/ig, s => s.substring(1).toUpperCase());

        // 将 controller 挂载到内存app上
        let tempController = controller; // 初始化贡献内存地址
        const names = name.split(sep);
        for (let i = 0, len = names.length; i < len; i++) {
            if (i === len - 1) {
                const ControllerModule = require(path.resolve(file))(app);
                tempController[names[i]] = new ControllerModule();
            } else {
                if (!tempController[names[i]]) {
                    tempController[names[i]] = {};
                }

                tempController = tempController[names[i]];
            }
        }
    }

    app.controller = controller;
};