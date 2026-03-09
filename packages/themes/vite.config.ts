/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }) => {
  const isProduction = command === 'build';

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
          name: 'NuclearThemes',
          formats: ['es'],
          fileName: 'index',
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
      },
    }),
    test: {
      globals: true,
      environment: 'jsdom',
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
