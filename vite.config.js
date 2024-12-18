// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// URL del backend en producción
const PROD_BACKEND_URL = 'https://archivo-h-backend-production.up.railway.app'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Determinar la URL del backend basado en el entorno
  const backendUrl = mode === 'production' 
    ? PROD_BACKEND_URL 
    : env.VITE_BACKEND_URL

  return {
    plugins: [react()],
    define: {
      // Inyectar la URL del backend en el código
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(backendUrl)
    },
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/auth': {
          target: backendUrl,
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 3000,
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return 'vendor'
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
    optimizeDeps: {
      include: [
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/react-fontawesome'
      ]
    }
  }
})
