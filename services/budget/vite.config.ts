import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import basicSsl from '@vitejs/plugin-basic-ssl'


// https://vitejs.dev/config/
export default defineConfig({
  // "path.resolve" calculates the absolute path to the root 
  // by going up 2 levels from this file (__dirname).
  // This is safer than '../..' because it works regardless of OS.
  envDir: path.resolve(__dirname, '../../'), 
  
  plugins: [react(), basicSsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 3001, //Change this to a port that is not used by other services
    strictPort: true,
    host: '127.0.0.1',   // Bind to local loopback
    allowedHosts: ['dev.wade-usa.com'] // Allow the spoofed domain
  },
})