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
const name = ref('createForm');
const isShow = ref(false);
const loading = ref(false);
const schemaFormRef = ref(null);

const show = (flag) => {
    isShow.value = true;

    const { title: configTitle, saveBtnText: configSaveBtnText } = components.value[name.value]?.config;
    title.value = configTitle;
    saveBtnText.value = configSaveBtnText;
};

const close = () => {
    isShow.value = false;
};

const save = async () => {
    if (!schemaFormRef.value?.validate()) { return; }

    loading.value = true;

    const res = await $curl({
        url: api.value,
        method: 'POST',
        data: schemaFormRef.value?.getValue()
    });

    loading.value = false;

    if (!res || !res.success) {
        return;
    }

    ElNotification({
        title: '创建成功',
        message: '创建成功',
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