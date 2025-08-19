import { createApp } from 'vue';

// 引入 elementPlus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

import '$elpisPages/assets/custom';

// 引入 pinia
import pinia from '$elpisStore';

// 引入 vue-router
import { createWebHistory, createRouter } from 'vue-router';

/**
 * 用于启动入口 vue
 * @params pageComponent 页面入口文件
 * @params routes 路由列表
 * @params libs 页面依赖的三方包
 */
export default (pageComponent, { routes = [], libs = [] } = {}) => {
    const app = createApp(pageComponent);
    // 应用 elementPlus
    app.use(ElementPlus);

    // 应用 pinia
    app.use(pinia);

    if (libs && libs.length) {
        for (let i = 0; i < libs.length; ++i) {
            app.use(libs[i]);
        }
    }

    if (routes && routes.length) {
        // 应用 vue-router
        const router = createRouter({
            history: createWebHistory(),
            routes
        });
        app.use(router);
        router.isReady().then(() => {
            app.mount('#root');
        });
    } else {
        app.mount('#root');
    }
};