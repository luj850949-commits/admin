import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores';

export const constantRoutes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/",
    name: "Layout",
    component: () => import("@/layout/index.vue"),
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        meta: { title: localStorage.getItem('locale') === 'zh' ? '首页' : 'Home' }
      }
      // 其他业务页面暂且移除，等下使用动态挂载方式加进来
    ]
  },
  {
    path: '/:pathMatch(.*)*', 
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'), 
  }
]

export const asyncRoutes = [
  {
    path: 'chat',
    name: 'Chat',
    component: () => import('@/views/chat/index.vue'),
    meta: { 
      title: localStorage.getItem('locale') === 'zh' ? 'AI 助手' : 'AI Assistant',
      roles: ['admin', 'common']
    }
  },
  {
    path: 'profile',
    name: 'Profile',
    component: () => import('@/views/profile/index.vue'),
    meta: { 
      title: localStorage.getItem('locale') === 'zh' ? '个人中心' : 'Profile',
      roles: ['admin']
    },
  },
  {
    path: 'error',
    name: 'Error',
    redirect: "/error/403",
    meta: { 
      title: localStorage.getItem('locale') === 'zh' ? '异常页面' : 'Error Pages',
      roles: ['admin', 'common']
    },
    children: [
      {
        path: '403',
        name: 'Error403',
        component: () => import('@/views/error/403.vue'),
        meta: { 
          title: '403',
          roles: ['admin', 'common']
        }
      },
      {
        path: '404',
        name: 'Error404',
        component: () => import('@/views/error/404.vue'),
        meta: { 
          title: '404',
          roles: ['admin', 'common']
        }
      },
      {
        path: '500',
        name: 'Error500',
        component: () => import('@/views/error/500.vue'),
        meta: { 
          title: '500',
          roles: ['admin', 'common']
        }
      }
    ]
  },
  {
    path: 'result',
    name: 'Result',
    redirect: "/result/success",
    meta: { 
      title: localStorage.getItem('locale') === 'zh' ? '结果页面' : 'Result Pages',
      roles: ['admin', 'common']
    },
    children: [
      {
        path: 'success',
        name: 'Success',
        component: () => import('@/views/result/success.vue'),
        meta: { 
          title: localStorage.getItem('locale') === 'zh' ? '成功页面' : 'Success',
          roles: ['admin', 'common']
        }
      },
      {
        path: 'fail',
        name: 'Fail',
        component: () => import('@/views/result/fail.vue'),
        meta: { 
          title: localStorage.getItem('locale') === 'zh' ? '失败页面' : 'Fail',
          roles: ['admin', 'common']
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

const whiteList = ['/lohin'];

// 全局路由守卫
router.beforeEach((to, from) => {
  const userStore = useUserStore()
  if (userStore.token) {
    if (to.path === '/login') {
      // 如果他已经登录了，还访问login，则直接踢回首页
      return '/'
    } else {
      // 将在这里进行拦截，根据 roles 过滤 asyncRoutes 并动态注入
    }
  } else {
    if (!whiteList.includes(to.path)) {
      return '/login'
    }
  }
});

export default router