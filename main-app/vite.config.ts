import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // This ensures that all built assets are referenced from the root
  base: '/', 
  build: {
    // Explicitly set the output to 'dist'
    outDir: 'dist',
    // Helps with pathing in monorepos
    emptyOutDir: true,
  }
})