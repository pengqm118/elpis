import input from './complex-view/input/input.vue';
import inputNumber from './complex-view/input-number/input-number.vue';
import select from './complex-view/select/select.vue';

// 读取 业务 schema-form 组件配置
import BusinessSchemaFormComponentConfig from '$businessSchemaFormComponentConfig';

const FormItemConfig = {
    input: {
        component: input
    },
    inputNumber: {
        component: inputNumber
    },
    select: {
        component: select
    }
};

export default {
    ...FormItemConfig,
    ...BusinessSchemaFormComponentConfig
};