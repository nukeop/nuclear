import { defineConfig } from 'vite';
import simpleHtmlPlugin from 'vite-plugin-simple-html';
import react from '@vitejs/plugin-react';
import path from 'path';
import renderer from 'vite-plugin-electron-renderer';


export default defineConfig({
  root: './',
  build: {
    outDir: '../dist'
  },
  plugins: [
    simpleHtmlPlugin(),
    react({
      include: ['**/*/.{jsx,tsx}']
    }),
    renderer()
  ],
  resolve: {
    alias: {
      '@nuclear/ui': path.resolve(__dirname, '../ui'),
      '@nuclear/core': path.resolve(__dirname, '../core')
    }
  }
});
