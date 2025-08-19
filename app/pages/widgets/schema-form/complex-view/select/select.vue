<template>
  <el-row type="flex" align="middle" class="form-item">
    <!-- label -->
    <el-row class="item-label" justify="end">
      <el-row
        v-if="schema?.option?.required"
        type="flex"
        class="required"
      >*</el-row>
      {{ schema.label }}
    </el-row>
    <!-- value -->
    <el-row class="item-value">
      <el-select
        v-model="dtoValue"
        v-bind="schema.option"
        class="component"
        :class="validTips ? 'valid-border' : ''"
        @change="onChange"
      >
        <el-option
          v-for="item in schema.option?.enumList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-row>

    <!-- 错误信息 -->
    <el-row v-if="validTips" class="valid-tips">
      {{ validTips }}
    </el-row>
  </el-row>
</template>

<script setup>
import { ref, toRefs, onMounted, watch, inject } from 'vue';

const props = defineProps({
    schemaKey: String,
    schema: Object,
    model: null
});
const ajv = inject('ajv');
const { schemaKey, schema } = props;
const { model } = toRefs(props);
const validTips = ref('');
const dtoValue = ref('');
const initData = () => {
    dtoValue.value = model.value ?? schema?.option?.default;
    validTips.value = '';
};

onMounted(() => {
    initData();
});
watch(
    [schema, model],
    () => {
        initData();
    }
);

const onChange = () => {
    validate();
};

const validate = () => {
    validTips.value = null;

    // 校验是否必填
    if (schema?.option?.required && !dtoValue.value) {
        validTips.value = '不能为空';
        return false;
    }

    if (dtoValue.value) {
        const dtoEnum = schema.option?.enumList.map(i => i.value);
        const validate = ajv.compile({
            schema,
            enum: dtoEnum
        });
        const valid = validate(dtoValue.value);
        if (!valid && validate.errors?.[0]) {
            if (validate.errors[0].keyword === 'enum') {
                validTips.value = '取值超出枚举范围';
            } else {
                validTips.value = '不符合要求';
            }

            return false;
        }
    }

    return true;
};
const getValue = () => {
    return dtoValue.value !== undefined
        ? { [schemaKey]: dtoValue.value }
        : {};
};

defineExpose({
    validate,
    getValue
});
</script>

<style lang="less" scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>