const Koa = require('koa');
const path = require('path');
const { sep } = path; // 兼容不同操作系统上的斜杆
const env = require('./env');

const MiddlewareLoader = require('./loader/middleware.js');
const ServiceLoader = require('./loader/service.js');
const ControllerLoader = require('./loader/controller.js');
const RouterSchemaLoader = require('./loader/router-schema.js');
const ConfigLoader = require('./loader/config.js');
const ExtendLoader = require('./loader/extend.js');
const RouterLoader = require('./loader/router.js');

module.exports = {
    /**
     * 项目启动
     * @params options 项目配置
     */
    start(options = {}) {
        // 创建实例
        const app = new Koa();

        // 应用配置
        app.options = options;

        // 基础路径
        app.baseDir = process.cwd();

        // 业务文件路径
        app.businessDir = path.resolve(process.cwd(), `.${sep}app`);

        // 初始化环境配置
        app.env = env();

        MiddlewareLoader(app);
        console.log('-- [start] load middleware done --');

        RouterSchemaLoader(app);
        console.log('-- [start] load router-schema done --');

        ControllerLoader(app);
        console.log('-- [start] load controller done --');

        ServiceLoader(app);
        console.log('-- [start] load service done --');

        ConfigLoader(app);
        console.log('-- [start] load config done --');

        ExtendLoader(app);
        console.log('-- [start] load extend done --');

        // 注册 elpis 全局中间件 app/middlewares.js
        require(`..${sep}app${sep}middleware.js`)(app);
        console.log('-- [srart] load global elpis middlewares done --');

        // 注册 业务 全局中间件 app/middlewares.js
        try {
            require(`${app.businessDir}${sep}middleware.js`)(app);
        } catch (e) {
            console.log('[exception] there is no global business middlewares file');
        }

        RouterLoader(app);
        console.log('-- [start] load router done --');

        try {
            const port = process.env.PORT || 8080;
            const host = process.env.IP || '0.0.0.0';
            app.listen(port, host);
            console.log(`Listening on ${host}:${port}`);
        } catch(err) {
            console.log(err);
        }

        return app;
    }
};