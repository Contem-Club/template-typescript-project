import prettier from 'eslint-plugin-prettier'
import eslintPluginTs from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
      prettier
    },
    rules: {
      ...eslintPluginTs.configs.recommended.rules,
      'prettier/prettier': 'error'
    }
  }
]