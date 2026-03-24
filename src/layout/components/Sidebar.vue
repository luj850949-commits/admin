<template>
  <div 
    class="h-full bg-white dark:bg-[#141414] flex flex-col shrink-0 transition-all duration-300 z-20 border-r border-gray-100 dark:border-gray-800 overflow-hidden"
    :class="isCollapse ? 'w-[64px]' : 'w-[210px]'"
  >
    
    <div class="h-[60px] shrink-0 flex items-center justify-center font-bold text-gray-800 dark:text-white tracking-widest border-b border-gray-100 dark:border-gray-800 whitespace-nowrap overflow-hidden">
      <transition name="logo-fade">
        <span v-if="!isCollapse" class="text-xl">My Admin</span>
        <span v-else class="text-xl">Ad</span>
      </transition>
    </div>
    <!-- :default-active="$route.path" -->
     <!-- default-active="/dashboard" -->
    <el-scrollbar class="flex-1">
      <el-menu
        class="border-none w-full pure-menu-vertical"
        :default-active="$route.path"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/home">
          <el-icon><DataBoard /></el-icon>
          <template #title><span>{{ t('layout.frontPage') }}</span></template>
        </el-menu-item>
        
        <el-menu-item index="/chat">
          <el-icon><ChatDotRound /></el-icon>
          <template #title><span>{{ t('layout.chat') }}</span></template>
        </el-menu-item>
        
        <el-menu-item index="/profile">
          <el-icon><User /></el-icon>
          <template #title><span>{{ t('layout.profile') }}</span></template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { DataBoard, ChatDotRound, User } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

interface SidebarProps {
  isCollapse: boolean;
}

withDefaults(defineProps<SidebarProps>(), {
  isCollapse: false
})
</script>

<style scoped>
/* 侧边栏展开时的宽度 */
.el-menu-vertical:not(.el-menu--collapse) {
  width: 210px;
}

/* 透明化菜单底色，让它吃外层 div 的自适应背景色 */
.pure-menu-vertical {
  background-color: transparent !important;
}

/* Hover：文字变蓝，背景变成极浅的蓝色 */
:deep(.el-menu-item:hover) {
  color: var(--el-color-primary) !important;
  /* 使用 ElementPlus 内置的浅色变量，在暗黑模式下会自动变暗 */
  background-color: var(--el-color-primary-light-9) !important;
}

/* 选中：文字加粗，浅蓝背景 */
:deep(.el-menu-item.is-active) {
  color: var(--el-color-primary) !important;
  background-color: var(--el-color-primary-light-9) !important;
  font-weight: bold;
  position: relative;
}

/* 选中态右侧的“经典高亮竖条”指示器 */
:deep(.el-menu-item.is-active::after) {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: var(--el-color-primary);
}

/* 修复菜单折叠时，右侧边框溢出的问题 */
:deep(.el-menu--collapse .el-menu-item.is-active::after) {
  display: none; 
}

/* 确保图标在选中/悬停时，颜色完美跟随文字 */
:deep(.el-menu-item:hover .el-icon),
:deep(.el-menu-item.is-active .el-icon) {
  color: inherit !important;
}

/* Logo 切换动画 */
.logo-fade-enter-active,
.logo-fade-leave-active {
  transition: opacity 0.3s ease;
}
.logo-fade-enter-from,
.logo-fade-leave-to {
  opacity: 0;
}
</style>