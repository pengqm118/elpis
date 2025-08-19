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
      <schema-form
        ref="schemaFormRef"
        v-loading="loading"
        :schema="components[name]?.schema"
        :model="formData"
      ></schema-form>
    </template>
    <template #footer>
      <el-button type="primary" @click="save">
        {{ saveBtnText }}
      </el-button>
    </template>
  </el-drawer>
</template>
<script setup>
import { ref, inject } from 'vue';
import SchemaForm from '$elpisWidgets/schema-form/schema-form.vue';
import $curl from '$elpisCommon/curl.js';
import { ElNotification } from 'element-plus';

const {
    api,
    components
} = inject('schemaViewData');
const emit = defineEmits(['command']);

const title = ref('');
const saveBtnText = ref('');
const name = ref('editForm');
const isShow = ref(false);
const loading = ref(false);
const schemaFormRef = ref(null);
const formData = ref(null);
const mainKey = ref(null);
const mainValue = ref(null);

const show = async (rowData) => {
    isShow.value = true;

    const { config } = components.value[name.value];
    title.value = config.title;
    saveBtnText.value = config.saveBtnText;
    mainKey.value = config.mainKey;
    mainValue.value = rowData[config.mainKey];

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

const close = () => {
    isShow.value = false;
};

const save = async () => {
    if (loading.value || !schemaFormRef.value?.validate()) { return; }

    loading.value = true;

    const res = await $curl({
        url: api.value,
        method: 'put',
        data: {
            [mainKey.value]: mainValue.value,
            ...schemaFormRef.value?.getValue()
        }
    });

    loading.value = false;

    if (!res || !res.success) {
        return;
    }

    ElNotification({
        title: '修改成功',
        message: '修改成功',
        type: 'success'
    });

    close();

    emit('command', { event: 'loadTableData' });
};

defineExpose({
    show,
    name
});
</script>
<style lang="less" scoped></style>