import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMenuStore = defineStore('menu', () => {
    // 菜单列表
    const menuList = ref([]);

    // 设置菜单列表
    const setMenuList = (list) => {
        menuList.value = list;
    };

    /**
     * @param mList 搜索菜单列表
     */
    function findFirstMenuItem (mList = menuList.value) {
        if (!mList || !mList[0]) { return; }

        let firstMenuItem = mList[0];
        if (firstMenuItem?.subMenu) {
            firstMenuItem = findMenuItem(firstMenuItem.subMenu);
        }
        return firstMenuItem;
    }

    /**
     * @param key 搜索字段
     * @param value 搜索值
     * @param mList 搜索菜单列表
     * @returns {*} 根据对应的 key 和 value 在mList中寻找匹配菜单对象
     */
    function findMenuItem ({ key, value }, mList = menuList.value) {
        for (let i = 0; i < mList.length; i++) {
            const menuItem = mList[i];
            if (!menuItem) { continue; }

            if (menuItem[key] === value) {
                return menuItem;
            }

            const { menuType, moduleType } = menuItem;

            if (menuType === 'group' && Array.isArray(menuItem.subMenu)) {
                const gItem = findMenuItem({ key, value }, menuItem.subMenu);
                if (gItem) { return gItem; }
            }

            if (moduleType === 'sider' && menuItem?.siderConfig?.menu) {
                const sItem = findMenuItem({ key, value }, menuItem.siderConfig.menu);
                if (sItem) { return sItem; }
            }
        }
    }

    return {
        menuList,
        setMenuList,
        findMenuItem,
        findFirstMenuItem
    };
});