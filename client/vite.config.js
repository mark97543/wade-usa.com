import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr'; // Import the SVGR plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
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