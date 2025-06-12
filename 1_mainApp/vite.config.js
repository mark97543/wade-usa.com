// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// const __dirname = path.dirname(new URL(import.meta.url).pathname);

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@components': path.resolve(__dirname, '../_components'),
//       '@contexts': path.resolve(__dirname, '../0_Contexts'),
//       '@directus/sdk': path.resolve(__dirname, '../node_modules/@directus/sdk/dist/index.js'), 

//     },
//   },

// });


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
      // ADD THIS NEW ALIAS FOR REACT-ROUTER-DOM
      'react-router-dom': path.resolve(__dirname, '../node_modules/react-router-dom/index.js'), // <-- NEW ALIAS
      // If the above doesn't work, try other common paths:
      // 'react-router-dom': path.resolve(__dirname, '../node_modules/react-router-dom/dist/main.js'),
      // 'react-router-dom': path.resolve(__dirname, '../node_modules/react-router-dom/dist/index.js'),
    },
  },
  optimizeDeps: {
    include: [
      // Ensure react-router-dom is listed here, although alias might make it redundant for dev
      'react-router-dom',
    ],
  },
  build: {
    rollupOptions: {
      // Ensure react-router-dom is NOT in external here
      // external: ['react', 'react-dom'] // Example, your build might not have this
    }
  }
});