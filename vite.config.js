// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// URL del backend en producción
const PROD_BACKEND_URL = 'https://archivo-h-backend-production.up.railway.app'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const backendUrl = mode === 'production' 
    ? PROD_BACKEND_URL 
    : env.VITE_BACKEND_URL

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(backendUrl)
    },
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/auth': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          }
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
