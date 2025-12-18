# Azure Functions v4 TypeScript Template

Template for building Azure Functions v4 applications using TypeScript and the v4 programming model (code-centric, no function.json files).

## Features

- Azure Functions v4 programming model
- TypeScript with strict mode
- Example HTTP trigger functions
- Health check endpoint
- ESLint and Prettier for code quality
- Jest for testing
- Environment-based configuration

## Prerequisites

- Node.js 20 LTS
- Azure Functions Core Tools v4.0.5382+
- Azurite (for local storage emulation) or Azure Storage Account

## Project Structure

```
├── host.json                 # Azure Functions runtime configuration
├── local.settings.json       # Local development settings (not in git)
├── .funcignore              # Files to exclude from deployment
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── src/
│   ├── index.ts            # Function registrations and implementations
│   ├── config/             # Application configuration
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── dist/                    # Compiled JavaScript (generated)
└── tests/                   # Test files
```

## Getting Started

### Installation

```bash
npm install
```

### Local Development

1. Start Azurite (Azure Storage Emulator):
```bash
azurite --silent --location c:\azurite --debug c:\azurite\debug.log
```

2. Build the TypeScript code:
```bash
npm run build
```

3. Start the Functions runtime:
```bash
npm start
```

Or use watch mode in a separate terminal:
```bash
npm run watch
```

### Available Endpoints

- **Hello Function**: `http://localhost:7071/api/hello?name=YourName` (GET/POST)
- **Health Check**: `http://localhost:7071/api/health` (GET)

### Testing

```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Azure Functions v4 Programming Model

This template uses the v4 programming model which:

- Eliminates the need for `function.json` files
- Uses code-based function registration with the `app` object
- Provides better TypeScript support
- Offers more flexible project structure

Example function:

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

export async function myFunction(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return { body: 'Hello World!' }
}

app.http('myFunction', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: myFunction,
})
```

## Configuration

Edit `local.settings.json` for local development settings.

For Azure deployment, configure Application Settings in the Azure Portal or via:
```bash
az functionapp config appsettings set --name <function-app-name> --resource-group <resource-group> --settings "APP_NAME=my-app"
```

## Deployment

Deploy to Azure:
```bash
func azure functionapp publish <function-app-name>
```

## Code Quality

Format code:
```bash
npm run format
```

Lint code:
```bash
npm run lint
```

## Learn More

- [Azure Functions TypeScript Developer Guide](https://learn.microsoft.com/azure/azure-functions/functions-reference-node)
- [Azure Functions v4 Programming Model](https://learn.microsoft.com/azure/azure-functions/functions-reference-node?tabs=typescript%2Cwindows%2Cazure-cli&pivots=nodejs-model-v4)
