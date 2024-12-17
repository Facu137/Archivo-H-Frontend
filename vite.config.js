// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom')
            ) {
              return 'vendor-react'
            }
            if (id.includes('zod') || id.includes('axios')) {
              return 'vendor-utils'
            }
            return 'vendor'
          }
          if (id.includes('/components/') || id.includes('/pages/')) {
            return 'components'
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    host: true,
    port: 5173
  }
})
