const KoaRouter = require('koa-router');
const path = require('path');
const { sep } = path;
const glob = require('glob');

/**
 * router Loader
 * @param app Koa 实例
 * 解析 app/router 下所有 js 文件，并注册到 KoaRouter 下
 */
module.exports = (app) => {
    // 实例化 KoaRouter
    const router = new KoaRouter();

    // 读取 elpis/router 文件目录
    const elpisRouterPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}router`);
    // 遍历 router 下所有文件并注册到 KoaRouter 实例上
    const elpisFileList = glob.sync(path.resolve(elpisRouterPath, `.${sep}**${sep}**.js`));
    elpisFileList.forEach(handleFile);

    // 读取 业务/router 文件目录
    const businessrouterPath = path.resolve(app.businessDir, `.${sep}router`);
    // 遍历 router 下所有文件并注册到 KoaRouter 实例上
    const businessFileList = glob.sync(path.resolve(businessrouterPath, `.${sep}**${sep}**.js`));
    businessFileList.forEach(handleFile);

    function handleFile(file) {
        require(path.resolve(file))(app, router);
    }

    // 路由兜底
    router.get('*', async (ctx, next) => {
        ctx.status = 302; // 临时重定向
        ctx.redirect(app?.options?.homePage ?? '/');
    });

    // 路由注册到 app 上
    app.use(router.routes());
    app.use(router.allowedMethods());
};