const md5 = require('md5');
/**
 * 接口签名认证
 * @param app Koa实例
 */
module.exports = app => {
    return async (ctx, next) => {
        // 仅对 API 进行签名验证
        if (!ctx.path.includes('/api')) {
            return await next();
        }

        const signKey = 'gdgg412ffsfafgafgdadadagagfhhdadw34';
        const { path, method } = ctx;
        const { s_sign, s_t } = ctx.request.headers;
        app.logger.info(`[${path} ${method}] signature: ${s_sign} s_t:${s_t}`);

        if (!s_sign || !s_t || s_sign !== md5(`${signKey}_${s_t}`) || Date.now() - s_t > 600000) {
            ctx.status = 200;
            ctx.body = {
                success: false,
                message: 'signature not correct or timeout',
                code: 445
            };
            return;
        }

        await next();
    };
};