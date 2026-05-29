import css from '@eslint/css';
import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import type { TSESLint } from '@typescript-eslint/utils';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import storybook from 'eslint-plugin-storybook';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import { tailwind4 } from 'tailwind-csstree';
import tseslint from 'typescript-eslint';

const ignores = [
  '**/src-tauri/**/*',
  '**/dist/**/*',
  '**/build/**/*',
  '**/target/**/*',
  '**/node_modules/**/*',
  '**/*.d.ts',
  '**/*.d.ts.map',
  '**/*.js.map',
  'packages/*/coverage',
  '**/.astro/**/*',
];

const config: TSESLint.FlatConfig.ConfigArray = tseslint.config([
  globalIgnores(ignores),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: [js.configs.recommended],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  storybook.configs['flat/recommended'],
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: [json.configs.recommended],
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: [markdown.configs.recommended],
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    languageOptions: {
      // @ts-expect-error broken in the typescript-eslint package
      tolerant: true,
      customSyntax: {
        ...tailwind4,
      },
    },
    extends: [css.configs.recommended],
    rules: {
      'css/no-invalid-at-rules': 0,
      'css/no-invalid-properties': 0,
    },
  },
  { ...prettierPlugin, ignores: ['**/*.md', '**/utilities.css'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    rules: {
      curly: ['error', 'all'],
    },
  },
]);

export default config;
