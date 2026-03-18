<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { useI18n } from 'vue-i18n'
import globalization from '@/assets/svg/globalization.svg'

// 国际化处理
const { locale } = useI18n()
const currentLang = useStorage('locale', 'zhCn');
const handleLangChange = (command: string) => {
  currentLang.value = command;
  locale.value = command;
}
</script>

<template>
  <el-dropdown trigger="click" @command="handleLangChange">
    <globalization
      class="hover:text-primary hover:bg-transparent! size-5 ml-1.5 cursor-pointer outline-hidden duration-300"
    />
    <template #dropdown>
      <el-dropdown-menu class="lang-dropdown">
        <el-dropdown-item command="zh" :class="{'is-active': currentLang === 'zh'}">
          <span class="w-5 inline-block text-center mr-1">
            <span v-if="currentLang === 'zh'">✔</span>
          </span> 
          简体中文
        </el-dropdown-item>
        
        <el-dropdown-item command="en" :class="{'is-active': currentLang === 'en'}">
          <span class="w-5 inline-block text-center mr-1">
            <span v-if="currentLang === 'en'">✔</span>
          </span> 
          English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>

</style>