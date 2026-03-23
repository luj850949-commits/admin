<template>
  <el-card style="max-width: 380px">
    <template #header>
      <div class="card-header">
        <span>DeepSeek</span>
      </div>
    </template>
      <deep-chat
        class="w-full h-full rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden"
        :history="history"
        :directConnection='{
          "deepSeek": {
            "key": "sk-dfa3cd8a633d4a6a84ec75a7f1fa2352",
            "system_prompt": "你是一个前端开发专家，精通 Vue.js 和相关技术栈，能够帮助用户解决各种前端开发问题。",
            "temperature": 0.7
          }
        }'
        :connect='{"stream": true}'
      ></deep-chat>
  </el-card>
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