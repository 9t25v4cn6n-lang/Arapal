import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // `archive/` holds screens removed from the live app but kept until their
  // behaviour is ported. Linting them reports debt nobody will ever pay.
  globalIgnores(['dist', 'archive/**', 'public/**']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Tooling, tests and config run in node, not the browser. Reporting
    // `process is not defined` there is the linter being mis-scoped, not a
    // defect in the code.
    files: ['scripts/**/*.{js,mjs}', 'tests/**/*.{js,mjs}', '*.config.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
