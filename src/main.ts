import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
// 国际化
import i18n from './locales'

import '@/style/main.css'
import '@/style/tailwindcss.css'
// 暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
