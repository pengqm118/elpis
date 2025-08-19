const path = require('path');

module.exports = (app) => {
    // 配置静态资源根目录
    const koaStatic = require('koa-static');
    app.use(koaStatic(path.resolve(process.cwd(), './app/public')));

    // 模版渲染引擎
    const koaNunjucks = require('koa-nunjucks-2');
    app.use(koaNunjucks({
        ext: 'tpl',
        path: path.resolve(process.cwd(), './app/public'),
        nunjucksConfig: {
            noCache: true,
            trimBlocks: true
        }
    }));

    // 引入 ctx.body 解析中间件
    const bodyParser = require('koa-bodyparser');
    app.use(bodyParser({
        formList: ['1000mb'],
        enableTypes: ['form', 'json', 'text']
    }));

    // 引入全局错误处理中间件(！！！需放置在其他业务中间件引入前，洋葱模型中第一个引入的可以达到囊括全局的作用)
    app.use(app.middlewares.errorHandler);

    // 接口签名认证
    app.use(app.middlewares.apiSignVerify);

    // 接口参数校验
    app.use(app.middlewares.apiParamsVerify);

    // project 处理
    app.use(app.middlewares.projectHandler);
};