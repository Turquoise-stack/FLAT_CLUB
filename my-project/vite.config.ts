// my-project/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : '/static/',
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://backend:8000',
        changeOrigin: true,
      }
    }
  }
}))

