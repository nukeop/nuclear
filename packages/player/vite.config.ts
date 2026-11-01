/// <reference types="vitest" />
/// <reference types="vite-plugin-svgr/client" />
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { codecovVitePlugin } from '@codecov/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackRouter } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const commitHash = (() => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
})();

export default defineConfig(() => ({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  plugins: [
    devtools(),
    react(),
    tanstackRouter(),
    tailwindcss(),
    svgr(),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: 'player',
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  resolve: {
    alias: {
      'tw-animate-css/dist': fileURLToPath(
        new URL('./node_modules/tw-animate-css/dist', import.meta.url),
      ),
    },
  },
  clearScreen: false,
  server: {
    host: process.env.VITE_HOST ?? 'localhost',
    port: 5173,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
    warmup: {
      clientFiles: ['./src/main.tsx', './src/initPlayerApp.tsx'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4120',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    clearMocks: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: { include: [/\.css\?raw$/] },
    reporters: ['default', ...(process.env.CI ? ['junit'] : [])],
    outputFile: { junit: './test-results/junit.xml' },
    coverage: {
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
        'dist/',
        'src-tauri/',
      ],
    },
  },
}));
