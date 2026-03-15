import { createI18n } from 'vue-i18n'

import en from "./en";
import zh from "./zh";

// 读取本地存储中的语言设置，如果没有则默认中文
const savedLanguage = localStorage.getItem('locale') || 'zh'

const i18n = createI18n({
  legacy: false, // 必须设为 false，才能使用 Vue3 的 Composition API
  locale: savedLanguage, // 初始语言
  fallbackLocale: 'zh', // 容错语言
  messages: {
    zh,
    en
  }
})

export default i18n