<template>
  <el-drawer
    v-model="isShow"
    direction="rtl"
    :destroy-on-close="true"
    :size="550"
  >
    <template #header>
      <h3 class="title">{{ title }}</h3>
    </template>
    <template #default>
      <el-card
        v-loading="loading"
        shadow="always"
        class="detail-panel"
      >
        <el-row
          v-for="(schemaItem, key) in components[name]?.schema?.properties"
          :key="key"
          type="flex"
          align="middle"
          class="row-item"
        >
          <el-row class="item-label">{{ schemaItem.label }}: </el-row>
          <el-row class="item-value">{{ formData[key] }} </el-row>
        </el-row>
      </el-card>
    </template>
  </el-drawer>
</template>
<script setup>
import { ref, inject } from 'vue';
import $curl from '$elpisCommon/curl.js';

const {
    api,
    components
} = inject('schemaViewData');

const title = ref('');
const name = ref('detailPanel');
const isShow = ref(false);
const loading = ref(false);
const formData = ref(null);
const mainKey = ref(null);
const mainValue = ref(null);

const show = async (rowData) => {
    isShow.value = true;

    const { config } = components.value[name.value];
    title.value = config.title;
    mainKey.value = config.mainKey;
    mainValue.value = rowData[config.mainKey];
    formData.value = {};

    await fetchFormData();
};

const fetchFormData = async () => {
    loading.value = true;
    const res = await $curl({
        method: 'get',
        url: api.value,
        query: {
            [mainKey.value]: mainValue.value
        }
    });
    loading.value = false;

    if (!res || !res.success || !res.data) {
        return;
    }

    formData.value = res.data;
};

defineExpose({
    show,
    name
});
</script>
<style lang="less" scoped>
.detail-panel {
  border: 1px solid #a6a6a6;
  padding: 30px;

  .row-item {
    height: 40px;
    line-height: 40px;
    font-size: 20px;

    .item-label {
      margin-right: 20px;
      width: 120px;
      color: #fff;
    }

    .item-value {
      color: #d2dae4;
    }
  }
}
</style>