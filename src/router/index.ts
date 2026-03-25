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
      redirect: "/home",
      children: [
        {
          path: "home",
          name: "Home",
          component: () => import("@/views/home/index.vue"), // 渲染在 Layout 内部的业务页
          meta: { title: localStorage.getItem('locale') === 'zh' ? '首页' : 'Home' }
        },
        {
          path: 'chat',
          name: 'Chat',
          component: () => import('@/views/chat/index.vue'),
          meta: { title: localStorage.getItem('locale') === 'zh' ? 'AI 助手' : 'AI Assistant' }
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/views/profile/index.vue'),
          meta: { title: localStorage.getItem('locale') === 'zh' ? '个人中心' : 'Profile' }
        },
      ]
    },
    {
      // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
      path: '/:pathMatch(.*)*', 
      name: 'NotFound',
      component: () => import('@/views/error/404.vue'), 
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
