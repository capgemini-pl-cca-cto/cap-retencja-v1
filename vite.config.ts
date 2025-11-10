/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import cp from 'vite-plugin-cp';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cp({
      targets: [{ src: 'INSTALLATION.md', dest: 'dist' }],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '',
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        dir: 'dist',
        entryFileNames: 'retencja-v1-app.js',
        assetFileNames: 'retencja-v1-app.[ext]',
        inlineDynamicImports: true,
      },
    },
  },
  test: {
    // Use jsdom environment so DOM matchers work
    globals: true,
    environment: 'jsdom',
    // Run this file before tests to register jest-dom matchers
    setupFiles: './src/setupTests.ts',
  },
});
