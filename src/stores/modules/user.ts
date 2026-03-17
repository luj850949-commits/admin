import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义一个名为 'user' 的全局状态库
export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const username = ref('')

  // 修改 token
  const setToken = (newToken: string) => {
    token.value = newToken
  }
  // 修改 username
  const setUsername = (newName: string) => {
    username.value = newName
  }
  // 清空个人信息
  const clearUserInfo = () => {
    token.value = ''
    username.value = ''
  }
  return {
    token,
    username,
    setToken,
    setUsername,
    clearUserInfo
  }
}, {
  // 开启持久化
  persist: true
})