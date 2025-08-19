module.exports = (app) => {
    const BaseController = require('./base.js')(app);
    return class ProjectController extends BaseController {
        // 根据 projKey 获取对应项目配置
        get(ctx) {
            const { proj_key: projKey } = ctx.request.query;
            const { project: projectService } = app.service;
            const projConfig = projectService.get(projKey);

            if (!projConfig) {
                this.fail(ctx, '获取项目异常', 50000);
                return;
            }

            this.success(ctx, projConfig);
        }
        // 通过 projKey 获取项目列表，不传则获取所有项目列表
        getList(ctx) {
            const {
                proj_key: projKey
            } = ctx.request.query;
            const { project: projectService } = app.service;

            const projList = projectService.getList(projKey);
            const dtoProjList = projList.reduce((preList, projObj) => {
                const { modelKey, key, name, desc, homePage } = projObj;
                preList.push({ modelKey, key, name, desc, homePage });
                return preList;
            }, []);

            this.success(ctx, dtoProjList);
        }
        // 获取模型和项目整合结构后的数据列表
        async getModelList(ctx) {
            const { project: projectService } = app.service;
            const resList = await projectService.getModelList();

            // 构造关键字段数据
            const dtoModelList = resList.reduce((preList, item) => {
                const { model, project } = item;
                const { name, desc, key } = model;
                const dtoModel = { name, desc, key };

                const dtoProject = Object.keys(project).reduce((preObj, projKey) => {
                    const { name, desc, homePage, key } = project[projKey];
                    preObj[projKey] = { name, desc, homePage, key };
                    return preObj;
                }, {});

                // 返回精简后的数据
                preList.push({
                    model: dtoModel,
                    project: dtoProject
                });
                return preList;

            }, []);

            this.success(ctx, dtoModelList);
        }
    };
};