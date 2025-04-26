import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { //  Match all requests starting with /api
        target: 'http://localhost:5000', //  Forward to your backend server
        changeOrigin: true,
        //  Not needed, we want the /api prefix: rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});