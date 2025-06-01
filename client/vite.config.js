import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr'; // Your existing SVGR plugin
import path from 'path';         // <-- ADDED: Node.js path module for resolving paths

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr()    // Your existing SVGR plugin
  ],
  resolve: { // <-- ADDED section to help with module resolution
    alias: {
      // This tells Vite that any import of '@directus/sdk' should
      // resolve to the package installed in 'client/node_modules/@directus/sdk'.
      // '__dirname' refers to the current directory (client/).
      '@directus/sdk': path.resolve(__dirname, 'node_modules/@directus/sdk'),

      // Optional: You can add an alias for easier imports from your 'blogs' directory
      // into your 'client/src' files if you wish. For example:
      // '@blogs': path.resolve(__dirname, '../blogs'),
      // Then, in a file like client/src/App.jsx, you could import using:
      // import MyBlogComponent from '@blogs/moving_to_usa/Moving_USA_Blog.jsx';
    },
    // If you were using symlinks extensively for your 'blogs' directory or other dependencies,
    // you might also need to consider 'preserveSymlinks: true', but try without it first.
  },
  server: {
    // Your existing proxy configuration
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    // --- ADDED/MODIFIED fs (filesystem) configuration ---
    fs: {
      // This allows Vite's development server to access files from:
      // 1. The project root itself (client/) - Vite usually allows this by default.
      // 2. The parent directory of 'client/' (which is 'wade-usa.com/').
      //    This is necessary for Vite to access and serve files from your '../blogs/' directory.
      allow: [
        path.resolve(__dirname, '..'), // Allows access to the parent directory (e.g., wade-usa.com/)
        // Vite's defaults usually cover the project root (client/) already,
        // but explicitly allowing the parent is key for accessing '../blogs'.
      ],
    },
  },
  // For the build process:
  // The 'resolve.alias' for '@directus/sdk' should also help Rollup (used by Vite for builds)
  // find the correct module when processing files imported from your 'blogs/' directory.
  // Ensure that any .jsx files from 'blogs/' are part of your build graph by being
  // imported into your application code within 'client/src/'.
});