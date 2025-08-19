<template>
  <el-row
    v-if="schema?.properties && Object.keys(schema.properties).length > 0"
    class="schema-form"
  >
    <template v-for="(item, key) in schema.properties">
      <component
        ref="formCompList"
        v-show="item?.option?.visible !== false"
        :is="FormItemConfig?.[item?.option?.compType]?.component"
        :model="model ? model[key] : undefined"
        :schema="item"
        :schemaKey="key"
      ></component>
    </template>
  </el-row>
</template>

<script setup>
import { provide, ref, toRefs } from 'vue';
import FormItemConfig from './form-item-config.js';

const props = defineProps({
    // schema 数据:结构如下
    // type: 'object',
    // properties: {
    //   key: {
    //     ...schema,
    //     type: '', // 字段类型
    //     label: '' // 字段名称,
    //     // 字段在 table 内的配置
    //     // 字段在 schema-search-bar 内的描述
    //     option: {
    //       ...elComponentOptions, // elementPlus 表格列 options
    //       compType: 'input', // 组件类型
    //       default: '', // 默认值
    //
    //       // 当 compType 为 select 时存在枚举值list
    //       enumList: [xxx],
    //       ...
    //     },
    //     // compOption 当前字段 key 在动态组件内的配置,以动态组件 createForm 为例
    //     option: {
    //       ...elComponentOptions, // elementPlus 表格列 options
    //       compType: 'input', // 组件类型
    //       default: '', // 默认值
    //       required: true,
    //       // 当 compType 为 select 时存在枚举值list
    //       enumList: [xxx],
    //       visible: true, // 当前字段在动态组件内的显示情况 true/false,默认为true
    //       diabled: false, // 禁用情况
    //     }
    //   },
    //   ...
    // },
    schema: Object,
    // 表单数据
    model: Object
});
const { model } = toRefs(props);
const Ajv = require('ajv');
const ajv = new Ajv();
provide('ajv', ajv);

const formCompList = ref([]);
const validate = () => {
    return formCompList.value.every(component => component.validate());
};
const getValue = () => {
    return formCompList.value.reduce((acc, item) => {
        return Object.assign(acc, item.getValue());
    }, {});
};

defineExpose({
    validate,
    getValue
});
</script>

<style lang="less">
.schema-form {
  .form-item {
    margin-bottom: 20px;
    min-width: 500px;

    .item-label {
      margin-right: 15px;
      min-width: 70px;
      text-align: right;
      font-size: 14px;
      color: #fff;
      word-break: break-all;

      .required {
        top: 2px;
        padding-left: 4px;
        color: #f56c6c;
        font-size: 20px;
      }
    }

    .item-value {
      .component {
        width: 320px;
      }

      .valid-border {
        .el-input__wrapper {
          border: 1px solid #F93F3F;
          box-shadow: 0 0 0 0;
        }
        .el-select__wrapper {
          border: 1px solid #F93F3F;
          box-shadow: 0 0 0 0;
        }
      }
    }

    .valid-tips {
      margin-left: 10px;
      height: 36px;
      line-height: 36px;
      overflow: hidden;
      font-size: 12px;
      color: #F93F3F;
    }
  }
}
</style>