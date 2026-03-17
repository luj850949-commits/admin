import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores';

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
router.beforeEach((to, from) => {
  const userStore = useUserStore()
  if (userStore.token) {
    if (to.path === '/login') {
      // 如果他已经登录了，还访问login，则直接踢回首页
      return '/'
    }
  } else {
    if (!whiteList.includes(to.path)) {
      return '/login'
    }
  }
});

export default router
