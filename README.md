# Typescript Template

A basic TypeScript template to use for new projects

1. Contains prettier + eslint support
2. VScode integration to format on safe
3. Proper TSConfig and build scripts + dependencies
4. Testing setup with Vitest


## Pre-Requisites

1. Make sure https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint extension is installed
2. Make sure https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode extension is installed
3. Make sure https://marketplace.visualstudio.com/items?itemName=vitest.explorer extension is installed for test integration

## Testing

This project uses Vitest for testing. The following npm scripts are available:

- `pnpm test` - Run tests once
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage report

Tests can be placed in any of the following locations:
- In the `src/__tests__` directory
- Any file in the src directory with `.test.ts` or `.spec.ts` suffix
- Any TypeScript file in the `tests/` directory at the project root

The tests now also work in the UI and Test panel (the labor glass icon)

## Trouble-Shooting

If linting does not work:
1. Check output (Terminal → Output → Eslint) to check for errors
2. Restart ESLint -> Cmd+Shift+P → ESLint: Restart ESLint Server

## Remarks

* Semicolons are off
* Single quotes
* Otherwise pretty much standard
