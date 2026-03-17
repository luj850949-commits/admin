<script setup lang="ts">
import { DataBoard, Document } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 简单的退出登录逻辑
const handleLogout = () => {
  // 清除本地存储的 Token
  localStorage.removeItem('token')
  // 跳转回登录页
  router.push('/login')
}
</script>

<template>
  <div class="h-screen w-screen overflow-hidden">
    <el-container class="h-full">
      
      <el-aside width="210px" class="bg-[#304156] text-white transition-all duration-300">
        <div class="h-[60px] flex items-center justify-center font-bold text-xl border-b border-gray-700 tracking-widest">
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
        
        <el-header class="bg-white border-b flex items-center justify-between px-5 shadow-sm h-[60px]">
          <div class="text-gray-600 font-medium">欢迎回来，管理员</div>
          
          <el-button type="danger" plain size="small" @click="handleLogout">
            退出登录
          </el-button>
        </el-header>

        <el-main class="bg-[#f0f2f5] p-4">
          <div class="bg-white w-full h-full rounded-md p-5 shadow-sm overflow-auto">
            <router-view></router-view>
          </div>
        </el-main>
        
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
/* 覆盖一下 Element Plus 菜单的默认边框，让侧边栏更清爽 */
.el-menu {
  border-right: none;
}
</style>