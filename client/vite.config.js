import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // This is the path that will be proxied
        target: 'http://localhost:5000', // Your backend server URL 
        changeOrigin: true, // Required for CORS issues
      },
      // You can add more proxy configurations here for other paths
    },
  },
});