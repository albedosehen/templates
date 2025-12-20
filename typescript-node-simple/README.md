# Basic Nodejs Template

Use this template to greenfield new projects that require a modern typescript setup as a base.

## Directory Structure

```text
<root>/
├── src/
│   ├── index.ts          # Entry point with path alias demos
│   ├── config/index.ts   # Configuration module
│   ├── types/index.ts    # Type definitions
│   └── utils/logger.ts   # Utility module
├── tests/
│   └── example.test.ts   # Sample Jest test
└── Configs
```

## Project Features

- Node.js `24.12.0` LTS with TypeScript (Works in earlier and newer versions of Node.js too)
- TypeScript with path aliases `@/` for `src/`
- ESLint and Prettier for code quality
- Jest for testing with path alias support
- Configuration examples in `src/config/`
- ESNext module support

## Configuration

- `.eslintrc.cjs` - ESLint with TypeScript
- `.prettierrc.json` - Code formatting
- `jest.config.ts` - Testing with path alias support

## Running The Project

First install dependencies:

```shell
cd templates/typescript-node-simple
npm i
```

### Dev

- `npm run dev` - Run with ts-node
- `npm run dev:watch` - Auto-restart on changes

### Building

- `npm run build` - Compile to JS
- `npm run start` - Run compiled code
- `npm run clean` - Remove `dist/` folder

### Testing

- `npm test` - Run tests
- `npm run test:watch` - Watch mode
- `npm run test:coverage` - Coverage report

### Code Quality

- `npm run lint` / `npm run lint:fix` - Linting
- `npm run format` / `npm run format:check` - Formatting
- `npm run type-check` - Type checking
