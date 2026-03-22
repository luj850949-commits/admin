<template>
  <div>
    <!-- 主题切换 -->
    <el-switch
      inline-prompt
      active-text="☀️"
      inactive-text="🌙"
      v-model="isDark"
      style="--el-switch-on-color: #409eff; --el-switch-off-color: #f2f2f2"
    />
  </div>
</template>

<script setup lang="ts">
import { useDark } from '@vueuse/core'

// 切换暗黑主题
const isDark = useDark({
  disableTransition: false // 关闭自带的“禁用过渡动画”功能
})
</script>

<style scoped>

</style>