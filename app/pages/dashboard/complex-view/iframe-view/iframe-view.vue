<template>
  <iframe :src="path" class="iframe" />
</template>

<script setup>
import { watch, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '$elpisPages/store/menu';

const menuStore = useMenuStore();
const path = ref('');
const route = useRoute();
const setPath = () => {
    const { key, sider_key } = route.query;
    const menuItem = menuStore.findMenuItem({
        key: 'key',
        value: sider_key || key
    });
    path.value = menuItem?.iframeConfig?.path ?? '';
};

watch([
    // sider-menu 的 moduleType 为 iframe 情形时
    () => route.query.sider_key,
    // header-menu 的 moduleType 为 iframe 情形时
    () => route.query.key,
    () => menuStore.menuList
],
() => {},
{ deep: true }
);
onMounted(() => {
    setPath();
});
</script>

<style scoped lang="less">
.iframe {
    border: 0;
    height: 100%;
    width: 100%;
}
</style>