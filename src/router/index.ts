import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore, usePermissionStore } from '@/stores';
import { filterAsyncRoutes } from './utils/filterAsyncRoutes'

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

const whiteList = ['/login'];

// 全局路由守卫
router.beforeEach((to, from) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  if (userStore.token) {
    if (to.path === '/login') {
      // 如果他已经登录了，还访问login，则直接踢回首页
      return '/'
    } else {
      // 如果用户已经有 token 了，但 permission store 中没有菜单树，说明这是第一次访问需要动态路由的页面
      if (permissionStore.wholeMenus.length === 0) {
        // 过滤出该用户能访问的路由树
        const accessedRoutes = filterAsyncRoutes(asyncRoutes, userStore.roles)
        // 将路由保存在 permission store 供侧边栏渲染
        permissionStore.setWholeMenus(accessedRoutes)
        // 将动态路由作为子路由，挂载到主框架 Layout 之下
        accessedRoutes.forEach(route => {
          router.addRoute('Layout', route)
        })
        return { ...to, replace: true } // 这样做的目的是为了确保 addRoute 完成后，再进行一次导航，避免出现路由未找到的情况
      }
    }
  } else {
    if (!whiteList.includes(to.path)) {
      return '/login'
    }
  }
});

export default router