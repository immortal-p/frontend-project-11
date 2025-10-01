import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**'],
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        FormData: 'readonly',
        DOMParser: 'readonly',
        Element: 'readonly',
      },
    },
    rules: {
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'brace-style': ['error', 'stroustrup'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'no-unused-vars': 'error',
      'no-undef': 'error',
    },
  },
]
