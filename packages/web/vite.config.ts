/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-image': '../../../node_modules/react-image/cjs/index.js'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' }
    }
  },
  css: {
    modules: {
      // This option is missing in vite config, but it should exist
      // @ts-ignore
      exportGlobals: true
    }
  }
});
