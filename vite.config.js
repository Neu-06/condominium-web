import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      // Todo lo que empiece con /api se redirige a tu backend
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
        // si usas cookies/sesiones y hay problemas agrega: cookieDomainRewrite: 'localhost'
      }
    }
  }
})
