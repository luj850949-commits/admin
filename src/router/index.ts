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
        path: "/home",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: 'frontPage',
          icon: 'House',
        }
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
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/chat/index.vue'),
    meta: { 
      title: 'chat',
      roles: ['admin', 'common'],
      icon: 'ChatDotRound'
    }
  },
  {
    path: '/error',
    name: 'Error',
    redirect: "/error/403",
    meta: { 
      title: 'errorPages',
      roles: ['admin', 'common'],
      icon: 'Warning'
    },
    children: [
      {
        path: '/error/403',
        name: 'Error403',
        component: () => import('@/views/error/403.vue'),
        meta: { 
          title: '403',
          roles: ['admin', 'common']
        }
      },
      {
        path: '/error/404',
        name: 'Error404',
        component: () => import('@/views/error/404.vue'),
        meta: { 
          title: '404',
          roles: ['admin', 'common']
        }
      },
      {
        path: '/error/500',
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
    path: '/result',
    name: 'Result',
    redirect: "/result/success",
    meta: { 
      title: 'resultPages',
      roles: ['admin', 'common'],
      icon: 'CircleCheck'
    },
    children: [
      {
        path: '/result/success',
        name: 'Success',
        component: () => import('@/views/result/success.vue'),
        meta: { 
          title: 'success',
          roles: ['admin', 'common']
        }
      },
      {
        path: '/result/fail',
        name: 'Fail',
        component: () => import('@/views/result/fail.vue'),
        meta: { 
          title: 'fail',
          roles: ['admin', 'common']
        }
      }
    ]
  },
  {
    path: '/permission',
    name: 'Permission',
    redirect: '/permission/page',
    meta: { 
      title: 'permission', 
      roles: ['admin', 'common'],
      icon: 'Key'
    },
    children: [
      {
        path: '/permission/page',
        name: 'PermissionPage',
        component: () => import('@/views/permission/page/index.vue'),
        meta: { 
          title: 'pagePermission',
          roles: ['admin', 'common']
        }
      },
      {
        path: '/permission/button',
        name: 'PermissionButton',
        component: () => import('@/views/permission/button/index.vue'),
        meta: { 
          title: 'buttonPermission',
          roles: ['admin', 'common']
        }
      }
    ]
  },
  
  // 系统管理模块,只有 admin 才能访问
  {
    path: '/system',
    name: 'System',
    redirect: '/system/user', // 默认重定向到用户管理
    meta: { 
      title: 'systemManagement',
      roles: ['admin'], // <--- 只有 admin 角色才会挂载这个路由
      icon: 'Lock'
    },
    children: [
      {
        path: '/system/user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: 'userMangerment',
          icon: 'User'
        }
      },
      {
        path: '/system/role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: 'roleMangerment',
          icon: 'UserFilled'
        }
      },
      {
        path: '/system/menu',
        name: 'SystemMenu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: 'menuManagement',
          icon: 'Menu'
        }
      },
      {
        path: '/system/dept',
        name: 'SystemDept',
        component: () => import('@/views/system/dept/index.vue'),
        meta: {
          title: 'deptMangerment',
          icon: 'OfficeBuilding'
        }
      }
    ]
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/index.vue'),
    meta: { 
      title: 'profile',
      roles: ['admin', 'common'],
      icon: 'User'
    },
  },
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
        return { path: to.fullPath, replace: true } // 这样做的目的是为了确保 addRoute 完成后，再进行一次导航，避免出现路由未找到的情况
      }
    }
  } else {
    if (!whiteList.includes(to.path)) {
      return '/login'
    }
  }
});

export default router