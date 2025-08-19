const glob = require('glob');
const path = require('path');
const { sep } = path;

/**
 *
 * @param Koa实例 app
 *
 * 加载所有 extend，可通过'app[`${extend1}`]' 访问
 * 例子：
 *    app/extend
 *       |
 *       |-- extend1
 *       |-- extend2
 *     => app.extend1, app.extend2
 */
module.exports = (app) => {
    // 读取 elpis/app/extend/**.js 下所有文件
    const elpisExtendPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}extend`);
    const elpisFileList = glob.sync(path.resolve(elpisExtendPath, `.${sep}**.js`));
    elpisFileList.forEach(handleFile);

    // 读取 业务/app/extend/**.js 下所有文件
    const businessExtendPath = path.resolve(app.businessDir, `.${sep}extend`);
    const businessFileList = glob.sync(path.resolve(businessExtendPath, `.${sep}**.js`));
    businessFileList.forEach(handleFile);

    // 遍历所有文件目录，将内容加载到app
    function handleFile(file) {
        // 提取文件名称
        let name = path.resolve(file);

        // 截取文件路径 app/extend/custom-extend.js => custom-extend.js
        name = name.substring(name.indexOf(`extend${sep}`) + `extend${sep}`.length, name.lastIndexOf('.'));
        // -替换为驼峰式写法  custom-extend => customExtend
        name = name.replace(/[_-][a-z]/ig, s => s.substring(1).toUpperCase());

        // 过滤已存在的 extend key
        for(let key in app) {
            if (key === name) {
                console.log(`[extend load error] name:${name} is already existed !`);
                return;
            }
        }

        app[name] = require(file)(app);
    }
};