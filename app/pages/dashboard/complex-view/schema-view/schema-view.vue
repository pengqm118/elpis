<template>
  <el-row class="schema-view">
    <search-panel
      v-if="searchSchema?.properties && Object.keys(searchSchema.properties).length > 0"
      @search="onSearch"
    ></search-panel>
    <table-panel
      ref="tablePanelRef"
      @operate="onOperate"
    ></table-panel>
    <!-- 动态组件展示 -->
    <component
      v-for="(item, key) in components"
      :key="key"
      :is="componentsConfig[key].component"
      ref="compRefList"
      @command="onComponentCommand"
    ></component>
  </el-row>
</template>

<script setup>
import { provide, ref } from 'vue';
import SearchPanel from './complex-view/search-panel/search-panel.vue';
import TablePanel from './complex-view/table-panel/table-panel.vue';
import { useSchema } from './hook/schema.js';
import componentsConfig from './components/components-config.js';

const {
    api,
    tableSchema,
    tableConfig,
    searchSchema,
    searchConfig,
    components
} = useSchema();

const apiParams = ref({});

provide('schemaViewData', {
    api,
    tableSchema,
    tableConfig,
    searchSchema,
    searchConfig,
    apiParams,
    components
});

const onSearch = (searchValObj) => {
    apiParams.value = searchValObj;
};

const compRefList = ref([]);
const tablePanelRef = ref(null);

// table 事件映射
const eventHandlerMap = {
    showComponent: showComponent
};
const onOperate = ({ btnConfig, rowData }) => {
    const { eventKey } = btnConfig;
    if (eventHandlerMap[eventKey]) {
        eventHandlerMap[eventKey]({ btnConfig, rowData });
    }
};
function showComponent ({ btnConfig, rowData }) {
    const { compName } = btnConfig?.eventOption ?? {};
    if (!compName) { return; }

    const compRef = compRefList.value.find(i => i.name === compName);
    if (!compRef || typeof compRef.show !== 'function') {
        console.warn(`找不到对应的component: ${compName}`);
        return;
    }

    compRef.show(rowData);
}

const onComponentCommand = (data) => {
    const { event } = data;
    if (event === 'loadTableData') {
        tablePanelRef.value?.loadTableData();
    }
};
</script>

<style scoped lang="less">
.schema-view {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
</style>