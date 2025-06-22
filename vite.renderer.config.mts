import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/frontend/components'),
      '@state': path.resolve(__dirname, './src/frontend/state'),
      '@composables': path.resolve(__dirname, './src/frontend/composables'),
    },
  },
});
