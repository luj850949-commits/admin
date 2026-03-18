<script setup lang="ts">
import { DataBoard, Document } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { Setting } from '@element-plus/icons-vue'

import translate from '@/components/translate.vue'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  userStore.clearUserInfo()
  router.push('/login')
}
</script>

<template>
  <div class="h-screen w-screen overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
    <el-container class="h-full">
      
      <el-aside width="210px" class="bg-[#304156] dark:bg-[#1a2b3c] text-white transition-all duration-300 border-r border-gray-700 dark:border-gray-800">
        <div class="h-[60px] flex items-center justify-center font-bold text-xl border-b border-gray-700 dark:border-gray-800 tracking-widest text-white">
          MyAdmin
        </div>
        
        <el-menu
          active-text-color="#409eff"
          background-color="#304156"
          text-color="#bfcbd9"
          class="border-r-0"
          default-active="/dashboard"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataBoard /></el-icon>
            <span>控制台大盘</span>
          </el-menu-item>
          <el-menu-item index="/article">
            <el-icon><Document /></el-icon>
            <span>文章管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        
        <el-header class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-5 shadow-sm h-[60px] transition-colors duration-300">
          <div class="text-gray-600 dark:text-gray-300 font-medium">欢迎回来，{{ userStore.username }}</div>
          <div class="h-full flex items-center justify-between gap-3">
            <div class="hover:bg-[#000000d9] h-full flex items-center w-10 justify-center">
              <translate></translate>
            </div>
            <el-icon>
              <Setting class="hover:text-primary"/>
            </el-icon>
            <el-button type="danger" plain size="small" @click="handleLogout">
            退出登录
            </el-button>
          </div>          
        </el-header>

        <el-main class="bg-[#f0f2f5] dark:bg-gray-950 p-4 transition-colors duration-300">
          <div class="w-full h-full rounded-xl overflow-auto pr-1">
            <router-view></router-view>
          </div>
        </el-main>
        
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.el-menu {
  border-right: none;
}
/* 深度覆盖菜单 hover 时的背景色 */
:deep(.el-menu-item:hover) {
  background-color: rgba(64, 158, 255, 0.1) !important;
}
</style>