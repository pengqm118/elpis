<template>
  <el-card class="search-panel">
    <schema-search-bar
      :schema="searchSchema"
      @load="onLoad"
      @search="onSearch"
      @reset="onReset"
    />
  </el-card>
</template>

<script setup>
import SchemaSearchBar from '$elpisWidgets/schema-search-bar/schema-search-bar.vue';
import { inject } from 'vue';

const {
    searchSchema
} = inject('schemaViewData');
const emit = defineEmits(['search']);

const onLoad = (searchValObj) => {
    emit('search', searchValObj);
};
const onSearch = (searchValObj) => {
    emit('search', searchValObj);
};
const onReset = () => {
    emit('search', {});
};

</script>

<style scoped lang="less">
.search-panel {
  margin: 10px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}
</style>