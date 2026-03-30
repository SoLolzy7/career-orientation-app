import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests to the local serverless function when using `vercel dev`
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})