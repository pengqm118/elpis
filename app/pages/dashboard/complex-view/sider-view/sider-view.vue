<template>
  <sider-container>
    <template #menu-content>
      <el-menu
        :default-active="activeKey"
        :ellipsis="false"
        @select="onMenuSelect"
      >
        <template v-for="item in menuList">
          <sub-menu
            v-if="item.subMenu && item.subMenu.length > 0"
            :menuItem="item"
          ></sub-menu>
          <el-menu-item
            v-else
            :index="item.key"
            :key="item.key"
          >{{ item.name }}</el-menu-item>
        </template>
      </el-menu>
    </template>
    <template #main-content>
      <router-view></router-view>
    </template>
  </sider-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useMenuStore } from '$elpisPages/store/menu';
import { useRouter, useRoute } from 'vue-router';
import SiderContainer from '$elpisWidgets/sider-container/sider-container';
import SubMenu from './complex-view/sub-menu.vue';

const menuStore = useMenuStore();
const router = useRouter();
const route = useRoute();
const activeKey = ref('');
const menuList = ref([]);

const setMenuList = () => {
    const headerMenuItem = menuStore.findMenuItem({
        key: 'key',
        value: route.query.key
    });
    if (headerMenuItem?.siderConfig.menu) {
        menuList.value = headerMenuItem.siderConfig.menu;
    }
};
const setActiveKey = () => {
    let siderMenuItem = menuStore.findMenuItem({
        key: 'key',
        value: route.query.sider_key
    });

    // 首次加载时未选中 sider，对应的 sider_key 为 undefined,需进一步根据 key 找对应的 headerMenu
    if (!siderMenuItem) {
        const headerMenuItem = menuStore.findMenuItem({
            key: 'key',
            value: route.query.key
        });
        if (headerMenuItem?.subMenu?.siderConfig?.menu) {
            const mList = headerMenuItem.subMenu.siderConfig.menu;
            siderMenuItem = menuStore.findFirstMenuItem(mList);
            handleSiderMenuSelect(siderMenuItem.key);
        }
    }
};

watch(() => route.query.key, () => {
    setMenuList();
    setActiveKey();
});
watch(() => menuStore.menuList, () => {
    setMenuList();
    setActiveKey();
});
onMounted(() => {
    setMenuList();
    setActiveKey();
});

const handleSiderMenuSelect = (siderMenuKey) => {
    const siderMenuItem = menuStore.findMenuItem({
        key: 'key',
        value: siderMenuKey
    });
    const { moduleType, key, customConfig } = siderMenuItem;

    // 同一菜单不做任何处理
    if (key === route.query.sider_key) { return; }

    const pathMap = {
        iframe: '/iframe',
        schema: '/schema',
        custom: customConfig?.path
    };
    router.push({
        path: `/view/dashboard/sider${pathMap[moduleType]}`,
        query: {
            sider_key: key,
            key: route.query.key,
            proj_key: route.query.proj_key
        }
    });
};

const onMenuSelect = (siderMenuKey) => {
    handleSiderMenuSelect(siderMenuKey);
};
</script>

<style scoped lang="less">

</style>