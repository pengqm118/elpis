module.exports = (app) => {
    const BaseService = require('./base')(app);
    const modelList = require('../../model/index')(app);
    return class ProjectService extends BaseService {
        // 根据 projKey 获取对应项目配置
        get(projKey) {
            const modelItem = modelList.find(modelItem => !!modelItem.project[projKey]);
            return modelItem?.project[projKey] ?? null;
        }
        // 通过 projKey 获取项目列表，不传则获取所有项目列表
        getList(projKey) {
            return modelList.reduce((preList, modelItem) => {
                const { project: projObj } = modelItem;

                if (projKey && !projObj[projKey]) { return preList; }

                for (const key in projObj) {
                    preList.push(projObj[key]);
                }
                return preList;
            }, []);
        }
        // 获取模型和项目数据列表
        getModelList() {
            return modelList;
        }
    };
};