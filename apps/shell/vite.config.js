import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // This is the new, correct package

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})