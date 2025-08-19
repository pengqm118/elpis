import input from './complex-view/input.vue';
import select from './complex-view/select.vue';
import dynamicSelect from './complex-view/dynamic-select.vue';

// 读取 业务 schema-search-bar 组件配置
import BusinessSchemaSearchBarComponentConfig from '$businessSchemaSearchBarComponentConfig';

const SearchItemConfig = {
    input: {
        component: input
    },
    select: {
        component: select
    },
    'dynamic-select': {
        component: dynamicSelect
    }
};
export default {
    ...SearchItemConfig,
    ...BusinessSchemaSearchBarComponentConfig
};