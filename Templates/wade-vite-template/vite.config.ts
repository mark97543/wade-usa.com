import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // "path.resolve" calculates the absolute path to the root 
  // by going up 2 levels from this file (__dirname).
  // This is safer than '../..' because it works regardless of OS.
  envDir: path.resolve(__dirname, '../../'), 
  
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})