import { useRoute } from 'vue-router';
import { ref, onMounted, watch, nextTick } from 'vue';
import { useMenuStore } from '$elpisStore/menu';

export const useSchema = function () {
    const api = ref('');
    const menuStore = useMenuStore();
    const route = useRoute();
    // table 相关配置
    const tableSchema = ref({});
    const tableConfig = ref();
    // schema-search-bar 相关配置
    const searchSchema = ref({});
    const searchConfig = ref();
    // 动态组件配置
    const components = ref();

    const buildData = () => {
        const { key, sider_key: siderKey } = route.query;
        const menuItem = menuStore.findMenuItem({
            key: 'key',
            value: siderKey ?? key
        });

        if (menuItem?.schemaConfig) {
            const { schemaConfig } = menuItem;
            api.value = schemaConfig.api ?? '';

            const configSchema = JSON.parse(JSON.stringify(schemaConfig.schema));
            tableSchema.value = {};
            tableConfig.value = undefined;
            searchSchema.value = {};
            searchConfig.value = undefined;
            components.value = undefined;

            nextTick(() => {
                // table 相关配置剥离
                tableSchema.value = buildDtoSchema(configSchema, 'table');
                tableConfig.value = schemaConfig.tableConfig;

                // search-bar 相关配置剥离
                const dotSearchSchema = buildDtoSchema(configSchema, 'search');
                // 路由上上携带的字段值赋值给字段默认值
                for (const key in dotSearchSchema.properties) {
                    if (route.query[key] !== undefined) {
                        dotSearchSchema.properties[key].option.default = route.query[key];
                    }
                }
                Object.keys(dotSearchSchema?.properties).forEach((key) => {

                });
                searchSchema.value = dotSearchSchema;
                searchConfig.value = schemaConfig.searchConfig;

                // 构造动态组件components配置
                const { componentsConfig } = schemaConfig;
                if (componentsConfig && Object.keys(componentsConfig).length > 0) {
                    const dtoComponents = {};
                    for (const compName in componentsConfig) {
                        dtoComponents[compName] = {
                            schema: buildDtoSchema(configSchema, compName),
                            config: componentsConfig[compName]
                        };
                    }
                    components.value = dtoComponents;
                }
            });
        }
    };

    /**
     * 清除杂质（提取纯净的参数）
     * @param _schema： schema配置对象
     * @param label：提取参数 label，与schema对象上option关键词相关，如tableOption则对应的label字段值为table
     * return  一个schema格式的包裹制定参数的对象
     */
    const buildDtoSchema = (_schema, label) => {
        if (!_schema?.properties) { return {}; }

        const dtoSchema = {
            type: 'object',
            properties: {}
        };
        for (const key in _schema.properties) {
            const props = _schema.properties[key];
            if (props[`${label}Option`]) {
                const dtoProps = { };
                for (const key in props) {
                    // 提取非 Option 相关数据
                    if (key.indexOf('Option') < 0) {
                        dtoProps[key] = props[key];
                    }
                }
                const propSchema = Object.assign({}, dtoProps, { option: props[`${label}Option`] });

                // 处理动态组件上的 required 约束
                const { required } = _schema;
                if (Array.isArray(required) && required.find(pk => pk === key)) {
                    propSchema.option.required = true;
                }

                dtoSchema.properties[key] = propSchema;
            }
        }

        return dtoSchema;
    };

    watch(
        [
            () => route.query.sider_key,
            () => route.query.key,
            () => menuStore.menuList
        ],
        () => {
            buildData();
        },
        { deep: true }
    );

    onMounted(() => {
        buildData();
    });

    return {
        api,
        tableSchema,
        tableConfig,
        searchSchema,
        searchConfig,
        components
    };
};
