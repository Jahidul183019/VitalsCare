import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: true,
      watch: {},
      proxy: {
        '/api': {
          target: 'https://health-risk-radar.onrender.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/overpass': {
          target: 'https://overpass-api.de/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/overpass/, ''),
        },
      },
    },
  };
});
