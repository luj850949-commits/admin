import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export const usePermissionStore = defineStore('permission', () => {
  // 用于存放最终能够在侧边栏渲染的菜单树
  const wholeMenus = ref<RouteRecordRaw[]>([])

  const setWholeMenus = (routes: RouteRecordRaw[]) => {
    // 首页
    const baseMenu = [{
      path: '/home',
      name: 'Home',
      component: () => import("@/views/home/index.vue"),
      meta: {
        title: 'frontPage',
      }
    }] as RouteRecordRaw[]

    wholeMenus.value = [...baseMenu, ...routes]
  }

  const clearMenus = () => {
    wholeMenus.value = []
  }

  return {
    wholeMenus,
    setWholeMenus,
    clearMenus
  }
})