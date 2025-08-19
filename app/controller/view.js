module.exports = (app) => {
    return class ViewController {
        async renderPage(ctx) {
            await ctx.render(
                `dist/entry.${ctx.params.page}`,
                {
                    env: app?.env?.get?.(),
                    options: app?.options,
                    name: app?.options?.name,
                    projKey: ctx.query?.proj_key
                }
            );
        }
    };
};