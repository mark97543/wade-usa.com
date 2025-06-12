// In ~/wade-usa.com/2_travel/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, '../_components'),
      '@contexts': path.resolve(__dirname, '../0_Contexts'),
      // If you use react-router-dom in 1_travel, add this alias as well
      'react-router-dom': path.resolve(__dirname, '../node_modules/react-router-dom/dist/index.js'),
    },
  },
  // ... other Vite configs
});