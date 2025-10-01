import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactX from 'eslint-plugin-react-x';
import pluginImport from 'eslint-plugin-import';
import reactDom from 'eslint-plugin-react-dom';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      import: pluginImport,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: '.',
        },
      },
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowExportNames: ['loader'] },
      ],
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // disables cross-feature imports:
            // eg. src/features/inwestycja should not import from src/features/kalkulator, etc.
            {
              target: './src/features/inwestycja',
              from: './src/features',
              except: ['./inwestycja'],
              message:
                'Importing from other features is not allowed. Please use shared components or libraries.',
            },
            {
              target: './src/features/kalkulator',
              from: './src/features',
              except: ['./kalkulator'],
              message:
                'Importing from other features is not allowed. Please use shared components or libraries.',
            },
            {
              target: './src/features/raport',
              from: './src/features',
              except: ['./raport'],
              message:
                'Importing from other features is not allowed. Please use shared components or libraries.',
            },
            // enforce unidirectional codebase:
            // e.g. src/app can import from src/features but not the other way around
            {
              target: './src/features',
              from: './src/app',
              message:
                'App can import from features, but features should not import from app.',
            },
            // e.g src/features and src/app can import from these shared modules but not the other way around
            {
              target: ['./src/components', './src/lib'],
              from: ['./src/features', './src/app'],
              message:
                'Shared components and libraries can be imported by features and app, but not the other way around.',
            },
          ],
        },
      ],
    },
  },
]);
