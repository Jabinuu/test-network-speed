import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  server: {
    port: 5173,
    // https: true,
    proxy: {
      '/api': {
        changeOrigin: true, // 代理服务器把原host首部值修改成target的url，否则导致target服务器找不到对应的虚拟主机，返回500
        target: 'https://pic3.zhimg.com/',
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
