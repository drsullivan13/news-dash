import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: mode === 'development' ? 'http://localhost:3000' : undefined,
        changeOrigin: true,
        secure: false,
      },
    },
  },
}))
