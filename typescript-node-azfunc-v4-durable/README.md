# Azure Durable Functions v4 TypeScript Template

A production-ready template for building Azure Durable Functions with TypeScript, featuring multiple orchestration patterns and comprehensive examples.

## Features

- Azure Functions v4 Programming Model
- Durable Functions with Task Hub configuration
- TypeScript with strict type checking
- Multiple orchestration patterns (Function Chaining, Fan-out/Fan-in, Human Interaction, Monitor)
- Path aliases (`@/`) for clean imports
- ESLint + Prettier for code quality
- Jest for testing
- Docker support with Azurite storage emulator
- Comprehensive health check endpoint

## Project Structure

```
.
├── src/
│   ├── index.ts                      # Main entry point, registers all functions
│   ├── config/
│   │   └── index.ts                  # Application configuration
│   ├── functions/
│   │   ├── orchestrators.ts          # Orchestrator functions (workflows)
│   │   ├── activities.ts             # Activity functions (work units)
│   │   └── clients.ts                # HTTP client/starter functions
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   └── utils/
│       └── logger.ts                 # Logging utilities
├── tests/
│   └── config/
│       └── index.test.ts             # Configuration tests
├── host.json                         # Azure Functions host configuration + Task Hub
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
└── docker-compose.yml                # Docker setup with Azurite
```

## Task Hub Configuration

The template includes a pre-configured Task Hub in `host.json`:

```json
{
  "extensions": {
    "durableTask": {
      "hubName": "MyTaskHub",
      "storageProvider": {
        "connectionStringName": "AzureWebJobsStorage"
      }
    }
  }
}
```

**Task Hub** is a logical container for durable orchestration instances. It maintains:

- Orchestration instance state
- Work item queues
- History tables

You can customize the `hubName` to isolate different environments or applications.

## Orchestration Patterns

### 1. Function Chaining (`helloOrchestrator`)

Sequential execution of activities where output of one becomes input of the next.

**Endpoint:** `GET/POST /api/orchestrators/hello?name=YourName`

**Pattern:**

```typescript
Activity1 → Activity2 → Activity3
```

**Use Cases:**

- Sequential data processing
- Multi-step workflows
- ETL pipelines

### 2. Fan-out/Fan-in (`fanOutFanInOrchestrator`)

Parallel execution of multiple activities, then aggregating results.

**Endpoint:** `GET/POST /api/orchestrators/fanout`

**Pattern:**

```typescript
           ┌─→ Activity1 ─┐
Orchestrator─→ Activity2 ─┼─→ Aggregate
           └─→ Activity3 ─┘
```

**Use Cases:**

- Batch processing
- Parallel API calls
- Map-reduce operations

### 3. Human Interaction (`approvalOrchestrator`)

Wait for external events (human approval) with timeout.

**Endpoint:** `POST /api/orchestrators/approval`

**Raise Event:** `POST /api/orchestrators/{instanceId}/raiseEvent?eventName=ApprovalEvent`

**Pattern:**

```typescript
Start → Wait for Event (or Timeout) → Process based on response
```

**Use Cases:**

- Approval workflows
- Manual intervention required
- User confirmation flows

### 4. Monitor Pattern (`monitorOrchestrator`)

Periodic polling of external status until completion or timeout.

**Endpoint:** `GET/POST /api/orchestrators/monitor?jobId=job123&maxRetries=10`

**Pattern:**

```typescript
Loop: Check Status → Sleep → Repeat until Complete/Failed/Timeout
```

**Use Cases:**

- Long-running job monitoring
- External service polling
- Health checks

## Available Activities

| Activity | Description | Input | Output |
|----------|-------------|-------|--------|
| `sayHello` | Returns greeting message | `string` | `string` |
| `getWorkBatch` | Returns array of work items | - | `string[]` |
| `processItem` | Processes single item | `string` | `string` |
| `processApproval` | Handles approval logic | `any` | `string` |
| `checkJobStatus` | Checks external job status | `string` | `string` |
| `validateData` | Validates input data | `any` | `boolean` |
| `sendNotification` | Sends notification | `object` | `boolean` |

## Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orchestrators/{instanceId}` | Get orchestration status |
| `POST` | `/api/orchestrators/{instanceId}/raiseEvent` | Raise external event |
| `POST` | `/api/orchestrators/{instanceId}/terminate` | Terminate running instance |
| `DELETE` | `/api/orchestrators/{instanceId}/purge` | Purge instance history |
| `GET` | `/api/health` | Health check endpoint |

## Getting Started

### Prerequisites

- Node.js 20+ (LTS recommended)
- Azure Functions Core Tools v4
- Docker & Docker Compose (for local storage)

### Installation

```bash
# Install dependencies
npm install

# Start Azurite storage emulator
docker-compose up -d

# Build the project
npm run build

# Start Azure Functions
npm start
```

### Configuration

Create a `local.settings.json` file:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node"
  }
}
```

## Usage Examples

### 1. Start Hello Orchestrator

```bash
# Start orchestration
curl "http://localhost:7071/api/orchestrators/hello?name=Azure"

# Response includes statusQueryGetUri
{
  "id": "abc123...",
  "statusQueryGetUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123?...",
  "sendEventPostUri": "...",
  "terminatePostUri": "...",
  "purgeHistoryDeleteUri": "..."
}
```

### 2. Check Orchestration Status

```bash
# Use statusQueryGetUri from previous response
curl "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123?..."

# Or use the management endpoint
curl "http://localhost:7071/api/orchestrators/abc123"
```

### 3. Raise Event (Human Interaction)

```bash
# Start approval orchestration
curl -X POST http://localhost:7071/api/orchestrators/approval \
  -H "Content-Type: application/json" \
  -d '{"request": "Purchase Order #12345"}'

# Raise approval event
curl -X POST "http://localhost:7071/api/orchestrators/{instanceId}/raiseEvent?eventName=ApprovalEvent" \
  -H "Content-Type: application/json" \
  -d 'true'
```

### 4. Monitor Pattern

```bash
# Start monitoring a job
curl "http://localhost:7071/api/orchestrators/monitor?jobId=job-456&maxRetries=20"
```

## Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run build:watch` | Watch mode compilation |
| `npm start` | Start Azure Functions locally |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Watch mode testing |
| `npm run test:coverage` | Generate coverage report |
| `npm run lint` | Lint code with ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Type check without emitting |

### Adding New Orchestrators

1. Create orchestrator function in `src/functions/orchestrators.ts`
2. Register in `src/index.ts`: `df.app.orchestration('name', handler)`
3. Add HTTP starter in `src/functions/clients.ts`
4. Register HTTP trigger in `src/index.ts`

### Adding New Activities

1. Create activity function in `src/functions/activities.ts`
2. Register in `src/index.ts`: `df.app.activity('name', { handler })`

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

## Docker Support

The template includes a `docker-compose.yml` that starts Azurite (Azure Storage emulator):

```bash
# Start storage emulator
docker-compose up -d

# View logs
docker-compose logs -f

# Stop emulator
docker-compose down
```

## Deployment

### Azure Portal

1. Create Azure Function App (Node.js 20, Linux)
2. Enable Application Insights (optional)
3. Configure storage account connection string
4. Deploy using VS Code Azure Functions extension or Azure CLI

### Azure CLI

```bash
# Create resource group
az group create --name myResourceGroup --location eastus

# Create storage account
az storage account create --name mystorageaccount --resource-group myResourceGroup

# Create function app
az functionapp create \
  --resource-group myResourceGroup \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --name myDurableFunctionApp \
  --storage-account mystorageaccount

# Deploy
npm run build
func azure functionapp publish myDurableFunctionApp
```

## Task Hub Management

### View Task Hub Storage

When deployed to Azure or running locally with Azurite, the Task Hub creates these storage structures:

- **Control Queue**: `{hubName}-control-{partition}`
- **Work Item Queue**: `{hubName}-workitems`
- **History Table**: `{hubName}History`
- **Instances Table**: `{hubName}Instances`

### Clean Up Task Hub

```bash
# Purge all instances by time range (Azure CLI)
az functionapp delete-durable-task-hub \
  --resource-group myResourceGroup \
  --name myDurableFunctionApp \
  --task-hub-name MyTaskHub
```

## Monitoring & Debugging

### Application Insights

Enable in Azure portal or add to `local.settings.json`:

```json
{
  "Values": {
    "APPINSIGHTS_INSTRUMENTATIONKEY": "your-key-here"
  }
}
```

### Logging

All orchestrators and activities support context logging:

```typescript
context.log('Processing item:', item)
```

Logs are visible in:

- Local: Terminal output
- Azure: Application Insights / Log Stream

## Best Practices

1. **Keep Activities Deterministic**: Activities can be retried; avoid side effects
2. **Don't Use Random/Time in Orchestrators**: Use `context.df.currentUtcDateTime`
3. **Handle Timeouts**: Use `context.df.createTimer()` for timeouts
4. **Use Structured Logging**: Include instance IDs in logs
5. **Monitor Queue Depths**: Watch control/work-item queues in production
6. **Set Appropriate Timeouts**: Configure in `host.json` under `durableTask`
7. **Purge Old Instances**: Clean up completed instances periodically

## Troubleshooting

### Issue: Functions not starting

**Solution:** Ensure Azurite is running and `AzureWebJobsStorage` is configured

### Issue: Orchestrator not completing

**Solution:** Check activity logs for errors, verify all activities are registered

### Issue: "Storage connection string not found"

**Solution:** Add to `local.settings.json` or environment variables

### Issue: Type errors with durable-functions

**Solution:** Ensure `@types/node` and TypeScript versions are compatible

## License

ISC

## Resources

- [Azure Durable Functions Documentation](https://learn.microsoft.com/azure/azure-functions/durable/)
- [Durable Functions Patterns](https://learn.microsoft.com/azure/azure-functions/durable/durable-functions-overview?tabs=in-process%2Cnodejs-v3%2Cv1-model&pivots=nodejs-model-v4)
- [Task Hubs](https://learn.microsoft.com/azure/azure-functions/durable/durable-functions-task-hubs)

## Author

albedosehen
