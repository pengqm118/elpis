/**
 * 全局错误捕获处理中间件
 * @param app Koa实例
 */
module.exports = app => {
    return async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            const { message, status, detail } = err;

            app.logger.info(JSON.stringify(err));
            app.logger.error('[--exception--error-handler]:', err);
            app.logger.error('[--exception--error-handler]:', message, status, detail);

            if (message.includes('template not found')) {
                ctx.status = 302;
                ctx.redirect(app?.options?.homePage);
                return;
            }

            const resBody = {
                success: false,
                code: 50000,
                massage: '网络异常 请稍后重试'
            };
            ctx.code = 200;
            ctx.body = resBody;
        }
    };
};