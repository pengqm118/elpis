<template>
  <el-card class="table-panel">
    <!-- operation-panel -->
    <el-row
      v-if="tableConfig?.headerButtons?.length > 0"
      justify="end"
      class="operation-panel"
    >
      <el-button
        v-for="item in tableConfig.headerButtons"
        v-bind="item"
        @click="operationHandler({ btnConfig: item })"
      >{{ item.label }}</el-button>
    </el-row>
    <schema-table
      ref="schemaTableRef"
      :api="api"
      :schema="tableSchema"
      :buttons="tableConfig?.rowButtons ?? []"
      :apiParams="apiParams"
      @operate="operationHandler"
    />
  </el-card>
</template>

<script setup>
import { ref, inject } from 'vue';
import SchemaTable from '$elpisWidgets/schema-table/schema-table.vue';
import $curl from '$elpisCommon/curl.js';
import { ElMessageBox, ElNotification } from 'element-plus';

const schemaTableRef = ref(null);
const emit = defineEmits(['operate']);
const {
    api,
    tableSchema,
    tableConfig,
    apiParams
} = inject('schemaViewData');

const EventKeyMap = {
    remove: removeData
};
const operationHandler = ({ btnConfig, rowData }) => {
    const { eventKey } = btnConfig;
    if (EventKeyMap[eventKey]) {
        EventKeyMap[eventKey]({ btnConfig, rowData });
    } else {
        emit('operate', { btnConfig, rowData });
    }
};

async function removeData ({ btnConfig, rowData }) {
    const { eventOption } = btnConfig;
    if (!eventOption?.params) { return; }

    const { params } = eventOption;
    const removeQuery = Object.keys(params).reduce((acc, key) => {
        const separateValueKey = params[key].split('::');
        const actualValue = separateValueKey[0] === 'schema' && separateValueKey[1]
            ? rowData[separateValueKey[1]] : params[key];
        return Object.assign(acc, { [key]: actualValue });
    }, {});

    ElMessageBox.confirm(
        `确认删除?`,
        'warning',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(async () => {
        schemaTableRef.value.showLoading();

        const res = await $curl({
            method: 'delete',
            url: api.value,
            query: removeQuery,
            errorMessage: '删除失败'
        });

        schemaTableRef.value.hideLoading();

        if (!res || !res.success || !res.data) { return; }

        ElNotification({
            title: '删除成功',
            message: '删除成功',
            type: 'success'
        });

        await initTableData();
    });
};

const initTableData = async () => {
    schemaTableRef.value.initData();
};

const loadTableData = async () => {
    schemaTableRef.value.loadTableData();
};

defineExpose({
    initTableData,
    loadTableData
});
</script>

<style scoped lang="less">
.table-panel {
  flex: 1;
  margin: 10px;
  .operation-panel {
    margin-bottom: 10px;
  }
}

:deep(.el-card-body) {
  height: 98%;
  display: flex;
  flex-direction: column;
}
</style>