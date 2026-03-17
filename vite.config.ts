import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
// ElementUI 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 导入tailwindcss
import tailwindcss from '@tailwindcss/vite'
// 引入 Mock 插件
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    // ElementUI 自动导入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    // 导入tailwindcss()
    tailwindcss(),
    // 启用mock插件
    viteMockServe({
      mockPath: 'mock', // 指定 mock 文件夹路径
      enable: true,     // 开启 mock 功能
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5173, // 固定的前端本地运行端口
    open: true, // 运行项目时自动在浏览器打开

    // 跨域
    // proxy: {
    //   // 拦截所有带有 '/api' 前缀的请求
    //   '/api': {
    //     // 目标地址
    //     target: 'http://localhost:8080', 
        
    //     // 允许跨域
    //     changeOrigin: true, 
        
    //     // 路径重写
    //     // 将 http://localhost:5173/api/login 替换成 http://localhost:8080/login
    //     rewrite: (path) => path.replace(/^\/api/, '') 
    //   }
    // }
  }
})
