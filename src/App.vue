<script setup lang="ts">
import { computed } from 'vue';
import { useStorage } from '@vueuse/core';

// 引入 Element Plus 官方提供的中英文语言包对象
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';

// 这里以你之前的 currentLang 为例
const currentLang = useStorage('locale', 'zh');

// 用 computed 做一层动态映射
const epLocale = computed(() => {
  return currentLang.value === 'zh' ? zhCn : en;
});
</script>

<template>
  <el-config-provider :locale="epLocale">
    <router-view></router-view>
  </el-config-provider>
</template>

<style>
.box{
  width: 100px;
  height: 100px;
  background-color: aqua;
}
</style>