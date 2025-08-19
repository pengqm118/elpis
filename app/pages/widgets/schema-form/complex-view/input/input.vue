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
      <el-input
        v-model="dtoValue"
        v-bind="schema?.option"
        class="component"
        :class="validTips ? 'valid-border' : ''"
        :placeholder="placeholder"
        @blur="onBlur"
        @focus="onFocus"
      ></el-input>
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
    model: String
});
const ajv = inject('ajv');
const { schemaKey, schema } = props;
const { model } = toRefs(props);
const validTips = ref('');
const dtoValue = ref('');
const placeholder = ref('');
const initData = () => {
    dtoValue.value = model.value ?? schema?.option?.default;
    validTips.value = '';

    const {
        minLength,
        maxLength,
        pattern
    } = schema;
    const ruleList = [];
    if (schema?.option?.placeholder) {
        ruleList.push(schema.option.placeholder);
    }
    if (minLength) {
        ruleList.push(`最小长度: ${minLength}`);
    }
    if (maxLength) {
        ruleList.push(`最大长度: ${maxLength}`);
    }
    if (pattern) {
        ruleList.push(`格式: ${pattern}`);
    }

    placeholder.value = ruleList.join('|');
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

const onBlur = () => {
    validate();
};
const onFocus = () => {
    validTips.value = null;
};

const validate = () => {
    validTips.value = null;

    // 校验是否必填
    if (schema?.option?.required && !dtoValue.value) {
        validTips.value = '不能为空';
        return false;
    }

    const { type } = schema;

    // ajv 校验 schema
    if (dtoValue.value) {
        const validate = ajv.compile(schema);
        const valid = validate(dtoValue.value);
        if (!valid && validate.errors && validate.errors[0]) {
            const { keyword, params } = validate.errors[0];
            if (keyword === 'type') {
                validTips.value = `类型必须为 ${type}`;
            } else if (keyword === 'maxLength') {
                validTips.value = `最大长度应为 ${params.limit}`;
            } else if (keyword === 'minLength') {
                validTips.value = `最小长度应为 ${params.limit}`;
            } else if (keyword === 'pattern') {
                validTips.value = '格式不正确';
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
</style>