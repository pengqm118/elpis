<template>
  <el-select
    v-model="dtoValue"
    v-bind="schema.option"
    class="select"
  >
    <el-option
      v-for="(item, idx) in schema.option?.enumList"
      :key="idx"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>
<script setup>
import { ref, onMounted } from 'vue';
const { schema, schemaKey } = defineProps({
    /**
     * {
     *   label: 'xxx',
     *   type: 'xxx',
     *   option: {
     *     default: 'xx',
     *     compType: 'xxx'
     *   }
     * }
     */
    schema: Object,
    schemaKey: String
});

const emit = defineEmits(['loaded']);
const reset = () => {
    dtoValue.value = schema?.option?.enumList?.[0]?.value;
};

const dtoValue = ref();
const getValue = () => {
    return dtoValue.value !== undefined
        ? { [schemaKey]: dtoValue.value }
        : {};
};

onMounted(() => {
    reset();
    emit('loaded');
});

defineExpose({
    reset,
    getValue
});
</script>
<style lang="less" scoped>

</style>