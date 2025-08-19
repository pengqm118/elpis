import boot from '$elpisBoot';
import dashboard from './dashboard';
import businessDashboardRouterConfig from '$businessDashboardRouterConfig';

const routes = [];
// 头部菜单路由
routes.push({
    path: '/view/dashboard/schema',
    component: () => import('./complex-view/schema-view/schema-view.vue')
});
routes.push({
    path: '/view/dashboard/iframe',
    component: () => import('./complex-view/iframe-view/iframe-view.vue')
});

// 侧边栏菜单路由
const siderChildrenRoutes = [{
    path: 'schema',
    component: () => import('./complex-view/schema-view/schema-view.vue')
}, {
    path: 'iframe',
    component: () => import('./complex-view/iframe-view/iframe-view.vue')
}];
routes.push({
    path: '/view/dashboard/sider',
    component: () => import('./complex-view/sider-view/sider-view.vue'),
    children: siderChildrenRoutes
});

// 业务路由扩展
if (typeof businessDashboardRouterConfig === 'function') {
    businessDashboardRouterConfig(routes, siderChildrenRoutes);
}

// 侧边路由兜底
routes.push({
    path: '/view/dashboard/sider/:chapters+',
    component: () => import('./complex-view/sider-view/sider-view.vue')
});

boot(dashboard, { routes });