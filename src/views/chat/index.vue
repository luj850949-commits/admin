<template>
  <div class="h-full w-full flex items-center justify-center p-2">
    <deep-chat
      :demo="true"
      :textInput="{ placeholder: { text: '请输入你的问题...' } }"
      :history="history"
    ></deep-chat>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'deep-chat' // 必须引入，以注册 <deep-chat> 标签

const history = ref([
  { role: 'ai', text: '你好！我是你的专属 AI 助手，有什么我可以帮你的吗？' },
]);
</script>

<style scoped>

</style>