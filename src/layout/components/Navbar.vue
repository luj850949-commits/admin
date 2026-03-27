<template>
  <div class="h-[60px] bg-white dark:bg-[#141414] border-b border-gray-100 dark:border-gray-800 px-5 flex items-center justify-between transition-colors duration-300">
    
    <div class="flex items-center h-full">
      <div 
        class="h-full flex items-center justify-center px-2 mr-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        @click="toggleSidebar"
      >
        <el-icon class="text-xl text-gray-600 dark:text-gray-300 transition-transform duration-300" :class="{'rotate-180': isCollapse}">
          <Fold />
        </el-icon>
      </div>
      
      <Breadcrumb />
    </div>
    
    <div class="flex items-center space-x-2 h-full">
      <el-dropdown trigger="click">
        <div class="flex items-center cursor-pointer h-full px-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors outline-none">
          <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class="w-[30px] h-[30px] rounded-full mr-2" />
          <span class="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {{ userStore.username }}
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item divided @click="toProfile">{{ t('layout.profile') }}</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">{{ t('layout.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 翻译按钮 -->
      <div class="flex items-center justify-center h-full px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <translate></translate>
      </div>
      <!-- 设置按钮 -->
      <div 
        class="flex items-center justify-center h-full px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        @click="openSettings"
      >
        <el-icon class="text-xl text-gray-600 dark:text-gray-300 hover:text-blue-500 animate-spin-slow-hover">
          <Setting />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Fold, Setting } from '@element-plus/icons-vue'
import Breadcrumb from './Breadcrumb.vue'
import { useUserStore, usePermissionStore } from '@/stores'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import translate from '@/components/translate.vue'

const userStore = useUserStore()
const permissionStore = usePermissionStore()
const router = useRouter()

interface NavbarProps {
  isCollapse: boolean;
}

// 结合 withDefaults 赋予默认值
withDefaults(defineProps<NavbarProps>(), {
  isCollapse: false
})

const emit = defineEmits<{
  (e: 'toggleCollapse'): void;
  (e: 'openSettings'): void;
}>()

const toggleSidebar = (): void => {
  emit('toggleCollapse')
}

const openSettings = (): void => {
  emit('openSettings')
}

const handleLogout = (): void => {
  userStore.clearUserInfo()
  permissionStore.clearMenus()
  router.push('/login')
}

const toProfile = (): void => {
  router.push('/profile')
}
</script>