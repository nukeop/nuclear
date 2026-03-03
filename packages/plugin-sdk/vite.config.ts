/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command, mode }) => {
  const isProduction = command === 'build';
  const isNpmBuild = mode === 'npm';

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(isProduction
        ? [
            dts({
              insertTypesEntry: true,
              copyDtsFiles: false,
              exclude: ['**/*.test.ts', '**/*.test.tsx'],
            }),
          ]
        : []),
    ],
    ...(isProduction && {
      build: {
        lib: {
          entry: 'src/index.ts',
          name: 'NuclearPluginSDK',
          formats: ['es'],
          fileName: 'index',
        },
        rollupOptions: {
          external: isNpmBuild
            ? ['react', 'react-dom']
            : ['react', 'react-dom', '@nuclearplayer/ui'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              '@nuclearplayer/ui': 'NuclearUI',
            },
          },
        },
      },
    }),
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
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
        ],
      },
    },
  };
});
