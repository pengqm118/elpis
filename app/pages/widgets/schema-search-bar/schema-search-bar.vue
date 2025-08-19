<template>
  <el-form
    v-if="schema?.properties && Object.keys(schema.properties).length > 0"
    :inline="true"
    class="schema-search-bar"
  >
    <!--  展示动态查询项子组件  -->
    <el-form-item
      v-for="(schemaItem, key) in schema?.properties"
      :key="key"
      :label="schemaItem.label"
    >
      <component
        ref="searchItemCompList"
        :is="SearchItemConfig?.[schemaItem?.option?.compType]?.component"
        :v-bind="schemaItem?.option"
        :schemaKey="key"
        :schema="schemaItem"
        @loaded="handleChildLoaded"
      />
    </el-form-item>
    <!--  操作区域  -->
    <el-form-item>
      <el-button
        type="primary"
        plain
        class="search-btn"
        @click="search"
      >搜索</el-button>
      <el-button
        type="primary"
        plain
        class="reset-btn"
        @click="reset"
      >重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ref, toRefs } from 'vue';
import SearchItemConfig from './search-item-config.js';

const emit = defineEmits(['load', 'search', 'reset']);
const props = defineProps({
    /**
     * search schema 相关配置:
     * type: 'object',
     *                 properties: {
     *                     key: {
     *                         ...schema,
     *                         type: '', // 字段类型
     *                         label: '' // 字段名称,
     *                         // 字段在 table 内的配置
     *                         tableOption: {
     *                             ...elComponentOptions, // elementPlus 表格列 options
     *                             // 用户自定义传参
     *                             toFixed: 2,
     *                             visible: true, // 表示在 table 中展示的列(为false或undefined则不展示)
     *                             xxxx,
     *                             ....
     *                         },
     *                         // 字段在 schema-search-bar 内的描述
     *                         searchOption: {
     *                             ...elComponentOptions, // elementPlus 表格列 options
     *                             compType: 'input', // 组件类型
     *                             default: '', // 默认值
     *                             ...
     *                         }
     *                     },
     *                     ...
     *                 }
     */
    schema: Object
});
const { schema } = toRefs(props);

const searchItemCompList = ref([]);
const getValue = () => {
    return searchItemCompList.value.reduce(
        (acc, cur) => Object.assign(acc, cur?.getValue())
        , {}
    );
};

let childCompLoadedNum = 0;
const handleChildLoaded = () => {
    childCompLoadedNum++;
    if (childCompLoadedNum >= schema?.value?.properties?.length) {
        emit('load', getValue());
    }
};

const search = () => {
    emit('search', getValue());
};
const reset = () => {
    searchItemCompList.value.forEach(comp => comp?.reset());
    emit('reset');
};

defineExpose({
    reset,
    getValue
});
</script>
<style lang="less">
.schema-search-bar {
  min-width: 500px;

  .input {
    width: 180px;
  }

  .select {
    width: 180px;
  }

  .dynamic-select {
    width: 180px;
  }

  .search-btn {
    width: 100px;
  }

  .reset-btn {
    width: 100px;
  }
}
</style>