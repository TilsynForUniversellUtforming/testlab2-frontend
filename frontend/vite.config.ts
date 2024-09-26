import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__test__/setup.ts',
    css: false,
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/csrf': {
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
