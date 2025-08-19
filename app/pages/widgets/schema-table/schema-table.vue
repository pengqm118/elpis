<template>
  <div class="schema-table">
    <el-table
      v-if="schema && schema.properties"
      :data="tableData"
      v-loading="loading"
      class="table"
    >
      <template v-for="(schemaItem, key) in schema.properties">
        <el-table-column
          v-if="schemaItem.option.visible !== false"
          :label="schemaItem.label"
          :prop="key"
          v-bind="schemaItem.option"
        ></el-table-column>
      </template>
      <el-table-column
        v-if="buttons?.length > 0"
        label="操作"
        fixed="right"
        :width="operationWidth"
      >
        <template #default="scoped">
          <el-button
            v-for="item in buttons"
            :key="item.name"
            v-bind="item"
            @click="operationHandler({ btnConfig: item, rowData: scoped.row })"
          >{{ item.label }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row justify="end" class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100, 200]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onPageSizeChange"
        @current-change="onCurrentPageChange"
      ></el-pagination>
    </el-row>
  </div>
</template>
<script setup>
import { ref, toRefs, onMounted, watch, nextTick, computed } from 'vue';
import $curl from '$elpisCommon/curl';

const props = defineProps({
    // 请求接口 API
    api: String,
    // 接口请求参数
    apiParams: Object,
    // 字段属性配置
    schema: Object,
    // 表格行操作按钮项
    buttons: Array
});

const emit = defineEmits(['operate']);
const { api, schema, buttons, apiParams } = toRefs(props);
const tableData = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(50);
const total = ref(0);

onMounted(() => {
    initData();
});

const operationWidth = computed(() => {
    return buttons?.value?.length ? buttons.value.reduce((acc, cur) => {
        return acc + cur.label.length * 28;
    }, 50) : 50;
});

watch(
    [api, schema, apiParams],
    () => {
        initData();
    },
    { deep: true }
);

const initData = () => {
    currentPage.value = 1;
    pageSize.value = 50;
    nextTick(async () => {
        await loadTableData();
    });
};

let timeId = null;
const loadTableData = async () => {
    clearTimeout(timeId);
    timeId = setTimeout(async () => {
        await fetchTableData();
        timeId = null;
    }, 100);
};

const fetchTableData = async () => {
    if (!api.value) { return; }

    showLoading();
    const res = await $curl({
        method: 'GET',
        url: `${api.value}/list`,
        query: {
            ...apiParams.value,
            page: currentPage.value,
            size: pageSize.value
        }
    });

    hideLoading();
    if (!res || !res.success || !Array.isArray(res.data)) {
        tableData.value = [];
        total.value = 0;
        return;
    }

    tableData.value = buildTableData(res.data);
    total.value = res?.metadata?.count ?? 0;
};

/**
 * 对接口返回的表格数据在渲染前进行预处理
 * @param listData 表格数据
 */
const buildTableData = (listData) => {
    if (!schema.value?.properties) {
        return listData;
    }

    return listData.map(rowData => {
        for (const dKey in rowData) {
            const schemaItem = schema.value[dKey];
            // 处理 toFixed
            if (schemaItem?.option?.toFixed) {
                rowData[dKey] = rowData[dKey].toFixed && rowData[dKey].toFixed(schemaItem.option.toFixed);
            }
        }
        return rowData;
    });
};

const operationHandler = ({ btnConfig, rowData }) => {
    emit('operate', { btnConfig, rowData });
};

const onPageSizeChange = async (size) => {
    pageSize.value = size;
    await loadTableData();
};

const onCurrentPageChange = async (page) => {
    currentPage.value = page;
    await loadTableData();
};

const showLoading = () => {
    loading.value = true;
};
const hideLoading = () => {
    loading.value = false;
};

defineExpose({
    initData,
    loadTableData,
    showLoading,
    hideLoading
});
</script>
<style lang="less" scoped>
.schema-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .table {
    flex: 1;
  }

  .pagination {
    margin: 10px 0;
    text-align: right;
  }
}
</style>