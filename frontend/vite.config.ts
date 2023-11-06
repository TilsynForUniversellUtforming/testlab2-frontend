import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
  resolve: {
    alias: {
      '@common': '/src/common',
      '@maaling': '/src/maaling',
      '@loeysingar': '/src/loeysingar',
      '@verksemder': '/src/verksemder',
      '@sak': '/src/sak',
      '@testreglar': '/src/testreglar',
    },
  },
});
