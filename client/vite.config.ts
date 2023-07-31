import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  //add vite alias
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    cors: false,
    proxy: {
      '/api': 'http://localhost:7071',
    },
  },
})
