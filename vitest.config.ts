import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.ts', 'tests/**/*.ts'],
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
