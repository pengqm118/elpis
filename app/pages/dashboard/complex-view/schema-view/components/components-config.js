import createFrom from './create-form/create-form.vue';
import editForm from './edit-form/edit-form.vue';
import detailPanel from './detail-panel/detail-panel.vue';

// 读取业务 schema-view 组件
import BusinessSchemaViewComponentConfig from '$businessSchemaViewComponentConfig';

const componentsConfig = {
    createForm: {
        component: createFrom
    },
    editForm: {
        component: editForm
    },
    detailPanel: {
        component: detailPanel
    }
};

export default {
    ...componentsConfig,
    ...BusinessSchemaViewComponentConfig
};