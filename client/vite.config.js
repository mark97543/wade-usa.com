import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr'; // Your existing SVGR plugin
import path from 'path';         // Node.js path module for resolving paths

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr()    // Your existing SVGR plugin
  ],
  resolve: {
    alias: {
      // Alias for @directus/sdk
      '@directus/sdk': path.resolve(__dirname, 'node_modules/@directus/sdk'),

      // --- ADDED ALIAS FOR react-router-dom ---
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),

      // Optional: You can add an alias for easier imports from your 'blogs' directory
      // '@blogs': path.resolve(__dirname, '../blogs'),
    },
  },
  server: {
    // Your existing proxy configuration
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    fs: {
      allow: [
        path.resolve(__dirname, '..'), // Allows access to the parent directory (e.g., wade-usa.com/)
      ],
    },
  },
});