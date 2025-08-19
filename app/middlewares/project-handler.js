/**
 * 处理 project 相关信息
 */
module.exports = (app) => {
    return async (ctx, next) => {
        if (ctx.path.indexOf('/api/proj/') === -1) {
            return await next();
        }

        const { proj_key } = ctx.request.headers;
        if (!proj_key) {
            ctx.status = 200;
            ctx.body = {
                code: 446,
                success: false,
                message: 'proj_key not found'
            };
            return;
        }

        ctx.projKey = proj_key;
        await next();
    };
};