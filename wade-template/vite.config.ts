import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 1. Force absolute paths for assets so the server doesn't get confused
  base: '/', 
  build: {
    // 2. Ensure the output directory is 'dist' (Easypanel/Nixpacks looks for this)
    outDir: 'dist',
    // 3. Clear the old build so no ghost files remain
    emptyOutDir: true,
    // 4. Ensure assets are nested correctly
    assetsDir: 'assets',
  },
})