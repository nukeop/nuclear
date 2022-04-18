/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-image': resolve(__dirname, '..', '..', 'node_modules/react-image/cjs/index.js')
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
