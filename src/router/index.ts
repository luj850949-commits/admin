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

export default router
