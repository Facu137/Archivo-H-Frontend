// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['tiff.js'] // Excluir tiff.js de la optimización de dependencias
  },
  build: {
    rollupOptions: {
      external: ['fs', 'path', 'crypto'], // Marcar estos módulos como externos
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})
