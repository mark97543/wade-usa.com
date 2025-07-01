import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import the path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@wade-usa/auth': path.resolve(__dirname, '../../packages/auth/src/index.js'),
      '@wade-usa/feature-home': path.resolve(__dirname, '../../packages/features/home/src/index.js'),
      '@repo/ui': path.resolve(__dirname, '../../packages/ui/src/index.js'),
      '@wade-usa/feature-travel' : path.resolve(__dirname, '../../packages/features/travel/src/index.js'),
    }
  }
})