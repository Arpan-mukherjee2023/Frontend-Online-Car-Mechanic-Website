import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Polyfill global for SockJS
export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  server: {
    proxy: {
      '/ws': 'http://localhost:8080',
    },
    hmr: {
      overlay: false, // disables the error overlay
    },
  }
});
