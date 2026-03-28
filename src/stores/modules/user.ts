import type { set } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义一个名为 'user' 的全局状态库
export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const username = ref('')
  const roles = ref<string[]>([])
  // 存储按钮级别的权限标识
  const permissions = ref<string[]>([])

  // 修改 token
  const setToken = (newToken: string) => {
    token.value = newToken
  }
  // 修改 username
  const setUsername = (newName: string) => {
    username.value = newName
  }
  // 修改 roles
  const setRoles = (newRoles: string[]) => {
    roles.value = newRoles
  }
  // 设置按钮权限的方法
  const setPermissions = (newPerms: string[]) => {
    permissions.value = newPerms
  }
  // 清空个人信息
  const clearUserInfo = () => {
    token.value = ''
    username.value = ''
    roles.value = []
    permissions.value = []
  }
  return {
    token,
    username,
    roles,
    permissions,
    setToken,
    setUsername,
    setRoles,
    setPermissions,
    clearUserInfo
  }
}, {
  // 开启持久化
  persist: true
})