const glob = require('glob');
const path = require('path');
const { sep } = path;
const _ = require('lodash');

/**
 * 项目配置继承重载模型基类
 * @param model 模型基类
 * @param project 项目子类
 */
function projExtendModel(model, project) {
    return _.mergeWith({}, model, project, (modelVal, projVal) => {
        if (Array.isArray(modelVal) && Array.isArray(projVal)) {
            const resultList = [];
            // 基类有子类没有：继承
            // 基类没有子类有：新增
            // 基类子类均有：重载(修改)

            // 继承和重载（以基类为基准考虑）
            for (let i = 0; i < modelVal.length; i++) {
                const modelItem = modelVal[i];
                const projItem = projVal.find(projItem => projItem.key === modelItem.key);
                resultList.push(projItem ? projExtendModel(modelItem, projItem) : modelItem);
            }

            // 新增（子类为基准考虑）
            for (let i = 0; i < projVal.length; ++i) {
                const projItem = projVal[i];
                if (!modelVal.find(modelItem => modelItem.key === projItem.key)) {
                    resultList.push(projItem);
                }
            }

            return resultList;
        }
    });
}

/**
 * 解析 model 配置，返回处理后的格式化数据,输出以下格式数据结构
 * [{
 *     model: ${model},
 *     project: {
 *         proj1: ${proj1},
 *         proj2: ${proj2},
 *         ...
 *     }
 * }, ...]
 */
module.exports = (app) => {
    const modelList = [];

    // 遍历 elpis model 文件夹，构造模型数据结构并挂载到 modelList 上
    const elpismodelPath = path.resolve(__dirname, `.${sep}`);
    const elpisFileList = glob.sync(path.resolve(elpismodelPath, `.${sep}**${sep}**.js`));
    elpisFileList.forEach(handleFile);

    // 遍历 business model 文件夹，构造模型数据结构并挂载到 modelList 上
    const businessModelPath = path.resolve(process.cwd(), `.${sep}model/`);
    const businessFileList = glob.sync(path.resolve(businessModelPath, `.${sep}**${sep}**.js`));
    businessFileList.forEach(handleFile);

    function handleFile(file) {
        if (file.indexOf('index.js') > -1) { return; }

        // 区分配置类型(model / project)
        // 正斜杆处理TODO
        const type = file.indexOf('/project/') > -1 ? 'project' : 'model';

        if (type === 'project') {
            const modelKey = file.match(/\/model\/(.*?)\/project\//)?.[1];
            const projKey = file.match(/\/project\/(.*?)\.js/)?.[1];
            let modelItem = modelList.find(item => item.model?.key === modelKey);
            if (!modelItem) {
                modelItem = {};
                modelList.push(modelItem);
            }
            if (!modelItem.project) {
                modelItem.project = {};
            }
            modelItem.project[projKey] = require(path.resolve(file));
            modelItem.project[projKey].key = projKey;
            modelItem.project[projKey].modelKey = modelKey;
        }

        if (type === 'model') {
            const modelKey = file.match(/\/model\/(.*?)\/model\.js/)?.[1];
            let modelItem = modelList.find(modelItem => modelItem.key === modelKey);
            if (!modelItem) {
                modelItem = {};
                modelList.push(modelItem);
            }
            modelItem.model = require(path.resolve(file));
            modelItem.model.key = modelKey;
        }
    }

    modelList.forEach(({ model: modelVal, project: projVal }) => {
        for (const projKey in projVal) {
            projVal[projKey] = projExtendModel(modelVal, projVal[projKey]);
        }
    });

    return modelList;
};