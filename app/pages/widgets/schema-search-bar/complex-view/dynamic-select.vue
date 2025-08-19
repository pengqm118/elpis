<template>
  <el-select
    v-model="dtoValue"
    v-bind="schema.option"
    class="dynamic-select"
  >
    <el-option
      v-for="(item, idx) in enumList"
      :key="idx"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import $curl from '$elpisCommon/curl.js'
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

const enumList = ref([]);
const fetchEnumList = async () => {
    const res = await $curl({
        method: 'GET',
        url: schema?.option?.api,
        data: {}
    });

    if (res?.data?.length) {
        enumList.value = res.data;
    }
};

const emit = defineEmits(['loaded']);
const reset = () => {
    dtoValue.value = enumList.value?.[0]?.value;
};

const dtoValue = ref();
const getValue = () => {
    return dtoValue.value !== undefined
        ? { [schemaKey]: dtoValue.value }
        : {};
};

onMounted(async () => {
    await fetchEnumList();
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