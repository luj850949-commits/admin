import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/login/index.vue"), // 占据全屏的登录页
    },
    {
      path: "/",
      name: "Layout",
      component: () => import("@/layout/index.vue"), // 带有侧边栏的框架
      redirect: "/dashboard",
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: () => import("@/views/dashboard/index.vue"), // 渲染在 Layout 内部的业务页
        },
        // ... 其他业务页面
      ]
    }
  ],
})

// 路由白名单
const whiteList = ['/login'];
// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 从本地存储中尝试获取 Token
  const token = localStorage.getItem('token');
  if (token) {
    if (to.path === '/login') {
      // 如果他已经登录了，还访问login，则直接踢回首页
      next('/'); 
    } else {
      // 去其他业务页面，直接放行！
      next(); 
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 如果他去的是登录页等白名单里的页面，直接放行
      next(); 
    } else {
      // 其他页面直接踢回登录页
      next('/login'); 
    }
  }
});

export default router
