/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    deps: {
      optimizer: {
        exclude: ['handlebars'],
      },
    },
  },
});
