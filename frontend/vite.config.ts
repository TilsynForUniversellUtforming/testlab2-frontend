import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__test__/setup.ts',
    css: false,
  },
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
      '@test': '/src/inngaaende-test',
      '@resultat': '/src/resultat',
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
