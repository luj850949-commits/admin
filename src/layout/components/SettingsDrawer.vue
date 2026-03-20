<template>
  <el-drawer 
    v-model="drawerVisible" 
    title="系统配置" 
    size="300px"
    append-to-body
  >
    <div class="flex flex-col space-y-6">
      <div>
        <h3 class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">主题模式</h3>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600 dark:text-gray-400">暗黑模式</span>
          <el-switch v-model="isDark" @change="toggleDark" />
        </div>
      </div>
      <el-divider class="my-0 border-gray-100 dark:border-gray-800" />
      <div>
        <h3 class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">系统语言</h3>
        <el-radio-group v-model="language" class="w-full flex">
          <el-radio-button label="zh" class="flex-1 text-center">简体中文</el-radio-button>
          <el-radio-button label="en" class="flex-1 text-center">English</el-radio-button>
        </el-radio-group>
      </div>
      <el-divider class="my-0 border-gray-100 dark:border-gray-800" />
      <div class="pt-4 mt-auto">
        <el-button type="danger" class="w-full" plain @click="handleLogout">
          <el-icon class="mr-1"><SwitchButton /></el-icon> 退出当前账号
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()

const drawerVisible = ref<boolean>(false)
const isDark = ref<boolean>(false)
const language = ref<string>('zh')

const openDrawer = (): void => {
  drawerVisible.value = true
}

// 暴露给父组件使用
defineExpose({ openDrawer })

onMounted(() => {
  if (localStorage.getItem('theme') === 'dark') {
    isDark.value = true
  }
})

// el-switch 的 change 回调
const toggleDark = (val: string | number | boolean): void => {
  if (Boolean(val)) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const handleLogout = (): void => {
  userStore.clearUserInfo()
  router.push('/login')
}
</script>