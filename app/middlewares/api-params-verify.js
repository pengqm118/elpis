const AJV = require('ajv');
const ajv = new AJV();

/**
 * 接口参数校验
 * @param app Koa实例
 */
module.exports = app => {
    const $schema = 'http://json-schema.org/draft-07/schema#';

    return async (ctx, next) => {
        // 仅对 API 进行参数验证
        if (!ctx.path.includes('/api/')) {
            return await next();
        }

        // 获取请求参数
        const { path, method, params } = ctx;
        const { body, query, headers } = ctx.request;

        app.logger.info(`[${method} ${path} --params-verify--] ${JSON.stringify(body)}]`);
        app.logger.info(`[${method} ${path} --params-verify--] ${JSON.stringify(params)}]`);
        app.logger.info(`[${method} ${path} --params-verify--] ${JSON.stringify(query)}]`);
        app.logger.info(`[${method} ${path} --params-verify--] ${JSON.stringify(headers)}]`);

        const schema = app.routerSchema?.[path]?.[method.toLowerCase()];

        if (!schema) {
            return await next();
        }

        let valid = true;
        // ajv 校验器
        let validator;

        // 校验 headers
        if (valid && headers && schema.headers) {
            schema.headers.$schema = $schema;
            validator = ajv.compile(schema.headers);
            valid = validator(headers);
        }

        // 校验 body
        if (valid && body && schema.body) {
            schema.body.$schema = $schema;
            validator = ajv.compile(schema.body);
            valid = validator(body);
        }

        // 校验 query
        if (valid && headers && schema.query) {
            schema.query.$schema = $schema;
            validator = ajv.compile(schema.query);
            valid = validator(query);
        }

        // 校验 params
        if (valid && headers && schema.params) {
            schema.params.$schema = $schema;
            validator = ajv.compile(schema.params);
            valid = validator(params);
        }

        if (!valid) {
            ctx.status = 200;
            ctx.body = {
                success: false,
                code: 442,
                message: `request validate fail: ${ajv.errorsText(validator.errors)}`
            };

            return;
        }

        await next();
    };
};