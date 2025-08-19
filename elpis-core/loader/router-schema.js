const glob = require('glob');
const path = require('path');
const { sep } = path;

/**
 * app/router-schema/**.js
 * routerSchema: {
 *     `${api1}`: `${routerSchema1}`,
 *     `${api2}`: `${routerSchema2}`,
 *     ...
 * }
 */

module.exports = (app) => {
    let routerSchema = {};

    // 读取 elpis/app/router-schema/**.js 下所有文件
    const elpisSchemaPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}router-schema`);
    const elpisFileList = glob.sync(path.resolve(elpisSchemaPath, `.${sep}**.js`));
    elpisFileList.forEach(handleFile);

    // 读取 业务/app/router-schema/**.js 下所有文件
    const businessSchemaPath = path.resolve(app.businessDir, `.${sep}router-schema`);
    const businessFileList = glob.sync(path.resolve(businessSchemaPath, `.${sep}**.js`));
    businessFileList.forEach(handleFile);

    function handleFile(file) {
        routerSchema = {
            ...routerSchema,
            ...require(path.resolve(file))
        };
    }

    app.routerSchema = routerSchema;
};