import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义一个名为 'user' 的全局状态库
export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const username = ref('')
  const roles = ref<string[]>([])

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
  // 清空个人信息
  const clearUserInfo = () => {
    token.value = ''
    username.value = ''
    roles.value = []
  }
  return {
    token,
    username,
    roles,
    setToken,
    setUsername,
    setRoles,
    clearUserInfo
  }
}, {
  // 开启持久化
  persist: true
})