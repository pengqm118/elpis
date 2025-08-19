<template>
  <el-config-provider :locale="zhCn">
    <HeaderView
      :projName="projName"
      @menu-select="onMenuSelect"
    >
      <template #main-content>
        <router-view></router-view>
      </template>
    </HeaderView>
  </el-config-provider>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import HeaderView from './complex-view/header-view/header-view';
import $curl from '$elpisCommon/curl';
import { useMenuStore } from '$elpisPages/store/menu';
import { useProjectStore } from '$elpisPages/store/project';

const projName = ref('');
const router = useRouter();
const route = useRoute();

onMounted(() => {
    getProjectList();
    getProjectConfig();
});

const menuStore = useMenuStore();
const projectStore = useProjectStore();
// 请求 menuList 并存到 projectStore 中
async function getProjectList() {
    const res = await $curl({
        url: '/api/project/list',
        query: {
            proj_key: route.query.proj_key
        }
    });

    if (!res || !res.success || !res.data.length) {
        return;
    }

    projectStore.setProjectList(res.data);
}

// 请求 projectList 并存到 menuStore 中
async function getProjectConfig() {
    const res = await $curl({
        url: '/api/project',
        query: {
            proj_key: route.query.proj_key
        }
    });

    if (!res || !res.success || !res.data) {
        return;
    }

    const { name, menu } = res.data;

    projName.value = name;
    menuStore.setMenuList(menu);
}

const onMenuSelect = menuItem => {
    const { moduleType, key, customConfig } = menuItem;
    // 相同菜单不做跳转处理
    if (key === route.query.key) { return; }

    const pathMap = {
        iframe: '/iframe',
        sider: '/sider',
        schema: '/schema',
        custom: customConfig?.path
    };

    router.push({
        path: `/view/dashboard${pathMap[moduleType]}`,
        query: {
            key,
            proj_key: route.query.proj_key
        }
    });
};
</script>

<style lang="less" scoped>
:deep(.el-main) {
  padding: 0;
}
</style>