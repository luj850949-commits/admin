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
        :connect='{
          "url": "https://api.deepseek.com",
        }'
      ></deep-chat>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'deep-chat' // 必须引入，以注册 <deep-chat> 标签
import OpenAI from 'openai';

const API_KEY = 'sk-dfa3cd8a633d4a6a84ec75a7f1fa2352';

const openai = new OpenAI({
  dangerouslyAllowBrowser: true, // 允许在浏览器环境中使用（注意安全风险）
  baseURL: 'https://api.deepseek.com',
  apiKey: API_KEY,
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "deepseek-chat",
  });

  if(completion.choices[0]) console.log(completion.choices[0].message.content);
}

main();

const history = ref([
  { role: 'ai', text: '你好！我是你的专属 AI 助手，有什么我可以帮你的吗？' },
]);

</script>

<style scoped>

</style>