import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/style/main.css'
import '@/style/tailwindcss.css'
// 暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 国际化
import i18n from './locales'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
