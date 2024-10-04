import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'MainLogin', // 确保这里的name和守卫中的保持一致
    component: () => import('../../login/main-login')
  },
  {
    path: '/AddGoods',
    name: 'AddGoods',
    component: () => import('../../../app/features/main-pages/add-goods'),
    meta: { requiresAuth: true }  // 需要身份验证
  },
  {
    path: '/AllGoods',
    name: 'AllGoods',
    component: () => import('../../../app/features/main-pages/all-goods'),
    meta: { requiresAuth: true }  // 需要身份验证
  },
  {
    path: '/Cart',
    name: 'Cart',
    component: () => import('../../../app/features/main-pages/cart'),
    meta: { requiresAuth: true }  // 需要身份验证
  },
  {
    path: '/Orders',
    name: 'Orders',
    component: () => import('../../../app/features/main-pages/orders'),
    meta: { requiresAuth: true }  // 需要身份验证
  },
  {
    path: '/History',
    name: 'History',
    component: () => import('../../../app/features/main-pages/history'),
    meta: { requiresAuth: true }  // 需要身份验证
  },
  {
    path: '/',
    redirect: '/AllGoods'  // 默认重定向到 '/AllGoods'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/AllGoods'  // 未匹配路径重定向到 '/AllGoods'
  }
];

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, position) {
    return { x: 0, y: 0 };
  }
});

// 合并路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');  // 检查是否有 token

  console.log("Is authenticated:", isAuthenticated);  // 调试输出登录状态
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 路由需要身份验证
    if (!isAuthenticated) {
      // 用户未登录，跳转到登录页面
      next({ name: 'MainLogin' });  // 注意这里的name必须和routes中的一致
    } else {
      // 用户已登录，继续访问
      next();
    }
  } else {
    // 不需要身份验证的路由，直接访问
    next();
  }
});

export default router;
