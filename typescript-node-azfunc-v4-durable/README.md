# Azure Durable Functions v4 TypeScript Template

Template for building Azure Durable Functions v4 applications using TypeScript and the v4 programming model. Durable Functions extend Azure Functions with stateful orchestrations, enabling complex workflows like function chaining, fan-out/fan-in, and long-running processes.

## Features

- Azure Functions v4 programming model with Durable Functions extension
- TypeScript with strict mode
- Example orchestrator functions (function chaining, fan-out/fan-in)
- Activity functions for granular work units
- HTTP starter functions with status check URLs
- Health check endpoint
- ESLint and Prettier for code quality
- Jest for testing
- Environment-based configuration

## Prerequisites

- Node.js 20 LTS
- Azure Functions Core Tools v4.0.5382+ `npm install -g azure-functions-core-tools@4 --unsafe-perm true`
- Azurite (for local storage emulation) or Azure Storage Account
- Understanding of Durable Functions patterns

## Project Structure

```
├── host.json                 # Azure Functions runtime + Durable Task configuration
├── local.settings.json       # Local development settings (not in git)
├── .funcignore              # Files to exclude from deployment
├── package.json             # Dependencies including durable-functions
├── tsconfig.json            # TypeScript configuration
├── src/
│   ├── index.ts            # Orchestrators, activities, and HTTP starters
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

1. Start Azurite (Azure Storage Emulator - REQUIRED for Durable Functions):
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

**HTTP Starters (initiate orchestrations):**
- **Hello Orchestrator**: `http://localhost:7071/api/orchestrators/hello?name=YourName` (GET/POST)
- **Fan-out/Fan-in**: `http://localhost:7071/api/orchestrators/fanout` (GET/POST)
- **Health Check**: `http://localhost:7071/api/health` (GET)

**Management API** (returned in HTTP starter response):
- Status query: Check orchestration status
- Terminate: Stop running orchestration
- Raise event: Send external event to orchestration
- Purge history: Clean up orchestration history

### Example Usage

1. Start an orchestration:
```bash
curl http://localhost:7071/api/orchestrators/hello?name=Azure
```

Response includes management URLs:
```json
{
  "id": "abc123...",
  "statusQueryGetUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123...",
  "sendEventPostUri": "...",
  "terminatePostUri": "...",
  "purgeHistoryDeleteUri": "..."
}
```

2. Check status:
```bash
curl <statusQueryGetUri>
```

3. Wait for completion (output in `output` field when `runtimeStatus` is "Completed")

### Testing

```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Durable Functions Patterns

### 1. Function Chaining
Sequential execution where each activity uses the previous result:
```typescript
const orchestrator: OrchestrationHandler = function* (context) {
  const x = yield context.df.callActivity('F1')
  const y = yield context.df.callActivity('F2', x)
  return yield context.df.callActivity('F3', y)
}
```

### 2. Fan-out/Fan-in
Parallel execution with aggregation:
```typescript
const orchestrator: OrchestrationHandler = function* (context) {
  const tasks = [
    context.df.callActivity('Process', 'item1'),
    context.df.callActivity('Process', 'item2'),
    context.df.callActivity('Process', 'item3'),
  ]
  const results = yield context.df.Task.all(tasks)
  return results
}
```

### 3. Async HTTP APIs
HTTP starter returns immediately with status URLs; client polls for completion.

### 4. Monitor Pattern (not implemented in template)
Recurring process with timers:
```typescript
const orchestrator: OrchestrationHandler = function* (context) {
  while (true) {
    yield context.df.callActivity('CheckCondition')
    const nextCheck = context.df.currentUtcDateTime
    nextCheck.setMinutes(nextCheck.getMinutes() + 30)
    yield context.df.createTimer(nextCheck)
  }
}
```

## V4 Programming Model

This template uses the v4 programming model for Durable Functions:

**Orchestrator Registration:**
```typescript
import * as df from 'durable-functions'

df.app.orchestration('orchestratorName', orchestratorHandler)
```

**Activity Registration:**
```typescript
df.app.activity('activityName', { handler: activityHandler })
```

**HTTP Starter with Durable Client:**
```typescript
import { app } from '@azure/functions'

app.http('starterName', {
  route: 'orchestrators/myOrchestrator',
  extraInputs: [df.input.durableClient()],
  handler: async (request, context) => {
    const client = df.getClient(context)
    const instanceId = await client.startNew('orchestratorName', { input: data })
    return client.createCheckStatusResponse(request, instanceId)
  }
})
```

## Storage Requirements

Durable Functions require Azure Storage (or Azurite for local development):

**Local Development:**
- Use Azurite storage emulator
- Connection string: `UseDevelopmentStorage=true` (in local.settings.json)

**Azure Production:**
- Azure Storage Account required
- Set `AzureWebJobsStorage` app setting to storage connection string
- Creates control queues, work queue, and history/instances tables

## Configuration

### local.settings.json
Edit for local development:
```json
{
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node"
  }
}
```

### host.json
Durable Task Hub configuration:
- `hubName`: Isolates orchestrations (default: "MyTaskHub")
- `storageProvider.connectionStringName`: App setting name for storage
- Performance tuning: `maxConcurrentActivityFunctions`, `partitionCount`, etc.

## Deployment

Deploy to Azure:
```bash
func azure functionapp publish <function-app-name>
```

Ensure Azure Storage Account connection string is configured in Application Settings.

## Code Quality

Format code:
```bash
npm run format
```

Lint code:
```bash
npm run lint
```

## Orchestrator Constraints

**IMPORTANT:** Orchestrator code must be deterministic:
- ❌ No direct I/O operations (file, network, database)
- ❌ No random numbers or GUIDs
- ❌ No DateTime.now() (use `context.df.currentUtcDateTime`)
- ✅ Use activities for non-deterministic operations
- ✅ Use `context.df.callActivity()` for I/O work
- ✅ Generator functions (`function*`) with `yield`

## Learn More

- [Azure Durable Functions Overview](https://learn.microsoft.com/azure/azure-functions/durable/durable-functions-overview)
- [Durable Functions Patterns](https://learn.microsoft.com/azure/azure-functions/durable/durable-functions-overview?tabs=in-process%2Cnodejs-v4%2Cv4&pivots=javascript-programming-language#application-patterns)
- [TypeScript Durable Functions Guide](https://learn.microsoft.com/azure/azure-functions/durable/durable-functions-typescript)
- [Orchestrator Code Constraints](https://learn.microsoft.com/azure/azure-functions/durable/durable-functions-code-constraints)
