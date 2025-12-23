import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose to network
    proxy: {
      '/uploadURL': {
        target: 'http://192.168.0.134:5500',
        changeOrigin: true,
        secure: false,
      },
      '/generateAnswer': {
        target: 'http://192.168.0.134:5500',
        changeOrigin: true,
        secure: false,
      },
      '/uploadPDF': {
        target: 'http://192.168.0.134:5500',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
