{
    mode: 'dashboard', // 模版类型(DSL),不同模版类型数据结构不同，最终输出不同的领域模型
    name: '', // 名称
    desc: '', // 描述
    icon: '', // 图标
    homePage: '', // 首页(项目配置)
    // 头部菜单
    menu: [{
        key: '', // 菜单唯一标识
        name: '', // 菜单名称
        menuType: '', // 菜单类型，枚举值: group / module

        // 当 menuType === group 时，可填
        // 对应某个菜单点击时有下拉选择之类的场景
        subMenu: [{
            ...可递归menuItem(对应menu数组子项)
        }, ...],

        // 当 menuType === module 时，可填
        moduleType: '', // 枚举值: sider / iframe / custom / schema

        // 当 moduleType === sider 时,
        siderConfig: {
            menu: [{
                ...可递归menuItem(除moduleType===sider)
            }, ...]
        },

        // 当 moduleType === iframe 时
        iframeConfig: {
            path: '' // iframe 路径
        },

        // 当 moduleType === custom 时
        customConfig: {
            path: '' // 自定义路由路径
        },

        // 当 moduleType === schema 时
        schemaConfig: {
            api: '', // 数据源API(遵循RESTFUL规范),此处对应列表查询新增编辑查看删除api路径一样但method不一样，对于后端来说都用post但api路径不一样
            // 板块数据结构(遵循json-schema规范)
            schema: {
                type: 'object',
                properties: {
                    key: {
                        ...schema,
                        type: '', // 字段类型
                        label: '' // 字段名称,
                        // 字段在 table 内的配置
                        tableOption: {
                            ...elComponentOptions, // elementPlus 表格列 options
                            // 用户自定义传参
                            toFixed: 2,
                            visible: true, // 表示在 table 中展示的列(为false或undefined则不展示)
                            xxxx,
                            ....
                        },
                        // 字段在 schema-search-bar 内的描述
                        searchOption: {
                            ...elComponentOptions, // elementPlus 表格列 options
                            compType: 'input', // 组件类型
                            default: '', // 默认值

                            // 当 compType 为 select 时存在枚举值list
                            enumList: [xxx],
                            ...
                        },
                        // compOption 当前字段 key 在动态组件内的配置,以动态组件 createForm 为例
                        createFormOption: {
                            ...elComponentOptions, // elementPlus 表格列 options
                            compType: 'input', // 组件类型
                            default: '', // 默认值

                            // 当 compType 为 select 时存在枚举值list
                            enumList: [xxx],
                            visible: true, // 当前字段在动态组件内的显示情况 true/false,默认为true
                            diabled: false, // 禁用情况
                        },
                        // compOption 当前字段 key 在动态组件内的配置,以动态组件 editForm 为例
                        editFormOption: {
                            ...elComponentOptions, // elementPlus 表格列 options
                            compType: 'input', // 组件类型
                            default: '', // 默认值

                            // 当 compType 为 select 时存在枚举值list
                            enumList: [xxx],
                            visible: true, // 当前字段在动态组件内的显示情况 true/false,默认为true
                            diabled: false, // 禁用情况
                        },
                        detailPanel: {
                            ...elComponentOptions, // elementPlus 表格列 options
                            compType: 'input', // 组件类型
                            default: '', // 默认值

                            // 当 compType 为 select 时存在枚举值list
                            enumList: [xxx],
                            visible: true, // 当前字段在动态组件内的显示情况 true/false,默认为true
                            diabled: false, // 禁用情况
                        }
                    },
                    ...
                },
                required: ['xxx', ...] // 控制字段在动态组件内的必填约束（符合json-schema规范）
            },
            // 表格相关配置
            tableConfig: {
                // 表格上方按钮配置
                headerButtons: [{
                   label: '', // 按钮中文名
                    eventKey: '', // 按钮事件名
                    // 按钮事件配置
                    eventOption: {
                       compName: '', // 控制的动态组件名称,最终以 eventKey 对应的事件控制对应的eventOption.compName组件
                    },
                    ...elButtonOptions // 标准 el-button 传参
                }, ...],
                // 表格行按钮配置
                rowButtons: [{
                    label: '', // 按钮中文名
                    eventKey: '', // 按钮事件名
                    eventOption: {
                        // eventKey 为 remove 时需填写 params
                        params: {
                            // removeKey 为 remove接口调用的query传参键
                            // removeValue 分为常量值和变量，常量如1000，变量如字符串'user_id'
                            // 对 removeKey变量命名规则约束： schema::xxx，如schema::user_id，最终提取出user_id,配合rowData获取对应值
                            removeKey: removeValue
                        }
                    }, // 按钮事件配置
                    ...elButtonOptions // 标准 el-button 传参
                }, ...]
            },
            // schema-search-bar 相关配置
            searchConfig: {},
            // 动态组件配置
            componentsConfig: {
                //  设置动态组件相关配置,以动态组件 create-form 为例
                createForm: {
                    title: '', // 表单标题
                    saveBtnText: '', // 保存按钮文案
                },
                editForm: {
                    title: '', // 表单标题
                    saveBtnText: '', // 保存按钮文案
                    mainKey: '' // 表单唯一标识
                },
                detailPanel: {
                    title: '', // 表单标题
                    mainKey: '' // 表单唯一标识
                }
            }
        }
    }]
}