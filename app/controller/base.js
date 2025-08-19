module.exports = (app) => {
    return class BaseController {
        // 统一收拢 controller 公共能力
        constructor() {
            this.app = app;
            this.config = app.config;
        }

        /**
         * 请求成功处理
         * @param ctx {Object} 上下文
         * @param data {Object} 数据
         * @param metadata {Object} 附加数据
         */
        success(ctx, data = {}, metadata = {}) {
            ctx.status = 200;
            ctx.body = {
                success: true,
                data,
                metadata
            };
        }

        /**
         * 请求失败处理
         * @param ctx {Object} 上下文
         * @param message {Object} 数据
         * @param metadata {Object} 附加数据
         */
        fail(ctx, message, code) {
            ctx.body = {
                success: false,
                message,
                code
            };
        }
    };
};