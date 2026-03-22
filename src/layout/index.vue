<template>
  <div class="h-screen w-full flex overflow-hidden bg-[#f0f2f5] dark:bg-gray-950 transition-colors duration-300">
    
    <Sidebar :is-collapse="isCollapse" />

    <div class="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
      
      <Navbar 
        :is-collapse="isCollapse" 
        @toggle-collapse="isCollapse = !isCollapse"
        @open-settings="handleOpenSettings"
      />

      <div class="flex-1 overflow-auto p-4 relative">
        <div class="bg-white dark:bg-[#141414] min-h-full rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-colors duration-300">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
          <!-- <router-view></router-view> -->
        </div>
      </div>
      
    </div>

    <SettingsDrawer ref="settingsDrawerRef" />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'
import SettingsDrawer from './components/SettingsDrawer.vue'

// 控制侧边栏展开/折叠的状态
const isCollapse = ref<boolean>(false)

// 设置抽屉实例
const settingsDrawerRef = ref<InstanceType<typeof SettingsDrawer> | null>(null)

// 处理打开抽屉
const handleOpenSettings = (): void => {
  settingsDrawerRef.value?.openDrawer()
}
</script>

<style scoped>
/* Layout 页面只需保留核心的页面切换动画即可 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}
.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>