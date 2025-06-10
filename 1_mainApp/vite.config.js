import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; 

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, '../_components'),
      '@contexts': path.resolve(__dirname, '../0_Contexts'),
    }
  },
})
