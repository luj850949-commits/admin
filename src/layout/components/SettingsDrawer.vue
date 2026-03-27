<template>
  <el-drawer 
    v-model="drawerVisible" 
    :title="t('layout.systemConfiguration')"
    size="300px"
    append-to-body
  >
    <div class="flex flex-col space-y-6">
      <div>
        <h3 class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">{{ t('layout.themeMode') }}</h3>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('layout.darkMode') }}</span>
          <!-- <el-switch v-model="isDark" @change="toggleDark" /> -->
          <!-- 切换明暗主题 -->
          <changeTheme></changeTheme>
        </div>
      </div>
      <el-divider class="my-0 border-gray-100 dark:border-gray-800" />
      <div class="pt-4 mt-auto">
        <el-button type="danger" class="w-full" plain @click="handleLogout">
          <el-icon class="mr-1"><SwitchButton /></el-icon> {{ t('layout.logout') }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { SwitchButton } from '@element-plus/icons-vue'
import { useUserStore, usePermissionStore } from '@/stores'
import { useI18n } from 'vue-i18n'

import changeTheme from "@/components/changeTheme.vue";

const { t } = useI18n()

const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

const drawerVisible = ref<boolean>(false)

const openDrawer = (): void => {
  drawerVisible.value = true
}

// 暴露给父组件使用
defineExpose({ openDrawer })

const handleLogout = (): void => {
  userStore.clearUserInfo()
  permissionStore.clearMenus()
  router.push('/login')
}
</script>