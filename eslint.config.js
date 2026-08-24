import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // `archive/` holds screens removed from the live app but kept until their
  // behaviour is ported. Linting them reports debt nobody will ever pay.
  // The release-certification reorganisation moved historical material into
  // `1. Audit/` and `3. archive/` at the repo root — the latter carries a whole
  // historical Next.js app with minified `.next/` build output, which produced
  // ~3,800 false-positive lint errors until ignored here. `artifacts/` holds
  // regenerated QA/release evidence, not application code.
  globalIgnores([
    'dist',
    'archive/**',
    'public/**',
    'artifacts/**',
    '1. Audit/**',
    '3. archive/**',
  ]),
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
    plugins: { react },
    rules: {
      // ESLint core cannot see that a binding is used inside JSX. This config
      // used to work around that by ignoring every capitalised variable — which
      // silenced the false positives and, in the same stroke, hid every
      // genuinely unused component import in the codebase. jsx-uses-vars marks
      // JSX references as real uses, so the pattern is no longer needed and
      // dead imports become visible again.
      'react/jsx-uses-vars': 'error',
      // Still ignore capitalised UNUSED ARGS: a destructured component prop such
      // as `icon: Icon` that a variant chooses not to render is a deliberate
      // signature, not dead code.
      'no-unused-vars': ['error', { argsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Tooling, tests and config run in node, not the browser. Reporting
    // `process is not defined` there is the linter being mis-scoped, not a
    // defect in the code.
    // Legacy screens on the REFERENCE surface (see `surface: 'reference'` in
    // scripts/qa/standard.mjs). These are retained only as behaviour sources
    // until their behaviour is ported, and unused declarations in them are the
    // point: RightPanel holds the Study summary and discussion-notes bodies and
    // their icons; MakeSegmentationFlowScreen holds SourceIntakeScreen and the
    // method labelling. The plan forbids deleting behaviour-bearing legacy
    // source before it is characterised, ported and verified, so the linter must
    // not push us into deleting the port's own input. Narrow to these two files
    // so the exemption cannot spread, and it goes away when they do.
    files: [
      'src/components/figma/RightPanel.jsx',
      'src/screens/MakeSegmentationFlowScreen.jsx',
    ],
    rules: { 'no-unused-vars': 'off' },
  },
  {
    // Fixtures are inputs to tests, not application code. tokenizedConsumer.jsx
    // imports a token it does not use because that is the pattern the token
    // doctrine audit exists to detect — "fixing" it would delete the test case.
    files: ['tests/fixtures/**'],
    rules: { 'no-unused-vars': 'off' },
  },
  {
    files: ['scripts/**/*.{js,mjs}', 'tests/**/*.{js,mjs}', '*.config.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
