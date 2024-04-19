import { defineConfig } from 'vite';
import simpleHtmlPlugin from 'vite-plugin-simple-html';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: '../dist'
  },
  plugins: [
    simpleHtmlPlugin(),
    react({
      include: ['**/*/.{jsx,tsx}']
    })
  ],
  resolve: {
    alias: {
      '@nuclear/ui': path.resolve(__dirname, '../packages/ui')
    }
  }
});
