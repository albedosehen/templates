# Durable Functions Quick Start Guide

This guide will help you quickly get started with the Azure Durable Functions template.

## What are Durable Functions?

**Durable Functions** is an extension of Azure Functions that lets you write stateful functions in a serverless environment. The Durable Functions framework manages state, checkpoints, and restarts automatically.

### Key Concepts

#### 1. **Orchestrator Functions**

- Define the workflow logic
- Must be deterministic (same input = same output)
- Cannot perform I/O operations directly
- Coordinate the execution of activity functions

#### 2. **Activity Functions**

- The basic units of work in a durable function orchestration
- Can perform I/O operations
- Can be retried and executed in parallel

#### 3. **Client Functions**

- Start, query, and manage orchestrations
- HTTP-triggered functions that interact with orchestrators

#### 4. **Task Hub**

- A logical container for orchestration instances
- Isolates orchestrations between environments
- Configured in `host.json`

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Storage Emulator

```bash
docker-compose up -d
```

This starts Azurite (Azure Storage Emulator) which is required for Durable Functions to store state.

### Step 3: Configure Settings

Copy the template and rename:

```bash
cp local.settings.json.template local.settings.json
```

No changes needed for local development!

### Step 4: Build & Run

```bash
npm run build
npm start
```

Wait for the message: `Functions: [multiple function names listed]`

## Try It Out

### Example 1: Simple Function Chaining

Start an orchestration:

```bash
curl "http://localhost:7071/api/orchestrators/hello?name=Developer"
```

You'll get a response like:

```json
{
  "id": "abc123def456",
  "statusQueryGetUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123def456?...",
  "sendEventPostUri": "...",
  "terminatePostUri": "...",
  "purgeHistoryDeleteUri": "..."
}
```

Check the status:

```bash
# Copy the statusQueryGetUri from above response
curl "http://localhost:7071/runtime/webhooks/durabletask/instances/abc123def456?..."
```

Response will show:

```json
{
  "name": "helloOrchestrator",
  "instanceId": "abc123def456",
  "runtimeStatus": "Completed",
  "input": "Developer",
  "output": [
    "Hello Developer - Tokyo!",
    "Hello Developer - Seattle!",
    "Hello Developer - London!"
  ],
  "createdTime": "2024-01-15T10:30:00Z",
  "lastUpdatedTime": "2024-01-15T10:30:01Z"
}
```

### Example 2: Parallel Processing (Fan-out/Fan-in)

```bash
curl -X POST "http://localhost:7071/api/orchestrators/fanout"
```

This will:

1. Get a batch of work items
2. Process all items in parallel
3. Aggregate results

Check status using the `statusQueryGetUri` from the response.

### Example 3: Human Interaction Pattern

Start an approval workflow:

```bash
curl -X POST http://localhost:7071/api/orchestrators/approval \
  -H "Content-Type: application/json" \
  -d '{"purchaseOrder": "PO-12345", "amount": 5000}'
```

The orchestration is now waiting for approval. To approve:

```bash
# Replace {instanceId} with the actual instance ID
curl -X POST "http://localhost:7071/api/orchestrators/{instanceId}/raiseEvent?eventName=ApprovalEvent" \
  -H "Content-Type: application/json" \
  -d 'true'
```

To reject, send `false` instead of `true`.

### Example 4: Monitor Pattern

Start monitoring a job:

```bash
curl "http://localhost:7071/api/orchestrators/monitor?jobId=job-789&maxRetries=15"
```

This will check the job status every 30 seconds until it completes, fails, or times out.

## Understanding the Task Hub

### What is a Task Hub?

A Task Hub is a **logical container** for durable orchestration data. It's configured in [`host.json`](typescript-node-azfunc-v4-durable/host.json:16):

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

### What's Stored in the Task Hub?

The Task Hub creates these Azure Storage resources:

1. **Control Queues**: `mytaskhub-control-00`, `mytaskhub-control-01`, etc.
   - Manage orchestration events
   - One per partition (default: 4 partitions)

2. **Work Items Queue**: `mytaskhub-workitems`
   - Activities to be executed

3. **History Table**: `mytaskhubHistory`
   - Orchestration execution history
   - Used for replaying orchestrations

4. **Instances Table**: `mytaskhubInstances`
   - Current state of orchestrations

### Why Use Different Task Hub Names?

```json
// Development
"hubName": "DevTaskHub"

// Staging
"hubName": "StagingTaskHub"

// Production
"hubName": "ProdTaskHub"
```

Benefits:

- **Isolation**: Different environments don't interfere
- **Testing**: Can test without affecting production
- **Multi-tenancy**: Separate task hubs per customer/tenant

### Viewing Task Hub Storage

Using Azure Storage Explorer or similar tool:

1. Connect to your storage account (or Azurite locally)
2. Look for queues starting with `mytaskhub-`
3. Look for tables: `mytaskhubHistory` and `mytaskhubInstances`

## Common Orchestration Patterns

### 1. Function Chaining

```
Activity A → Activity B → Activity C
```

**Use case**: Sequential workflows where each step depends on the previous

**Example**: Order processing

1. Validate order
2. Charge payment
3. Ship product

### 2. Fan-out/Fan-in

```
        ┌──→ Activity 1 ──┐
Start ──┼──→ Activity 2 ──┼──→ Aggregate → End
        └──→ Activity 3 ──┘
```

**Use case**: Parallel processing of multiple items

**Example**: Batch processing

1. Get list of files to process
2. Process all files in parallel
3. Aggregate results

### 3. Async HTTP APIs (Human Interaction)

```
Start → Wait for Event → Process → End
        ↑
        External Signal
```

**Use case**: Workflows requiring human input or external events

**Example**: Approval workflow

1. Submit approval request
2. Wait for manager approval (or timeout)
3. Process based on decision

### 4. Monitor

```
Loop: Check Condition → Sleep → Repeat until Done
```

**Use case**: Polling external services

**Example**: Job status monitoring

1. Submit job to external service
2. Poll every 30 seconds for completion
3. Return results when done

## Management Operations

### Check Orchestration Status

```bash
curl "http://localhost:7071/api/orchestrators/{instanceId}"
```

### Terminate Running Orchestration

```bash
curl -X POST "http://localhost:7071/api/orchestrators/{instanceId}/terminate?reason=Manual+stop"
```

### Clean Up Orchestration History

```bash
curl -X DELETE "http://localhost:7071/api/orchestrators/{instanceId}/purge"
```

### Health Check

```bash
curl "http://localhost:7071/api/health"
```

Shows all registered orchestrators and activities.

## Best Practices

### ✅ DO

1. **Keep orchestrators deterministic**
   - Always use `context.df.currentUtcDateTime` instead of `new Date()`
   - Use `context.df.createTimer()` for delays

2. **Handle timeouts properly**
   - Always set reasonable timeouts for external events
   - Use `Task.any()` to race between event and timeout

3. **Make activities idempotent**
   - Activities can be retried
   - Design them to handle multiple executions safely

4. **Use appropriate patterns**
   - Fan-out for parallel processing
   - Monitor for polling
   - Human interaction for approvals

### ❌ DON'T

1. **Don't use random or non-deterministic operations in orchestrators**

   ```typescript
   // ❌ Bad
   const random = Math.random()

   // ✅ Good - do it in an activity
   const random = yield context.df.callActivity('generateRandom')
   ```

2. **Don't perform I/O in orchestrators**

   ```typescript
   // ❌ Bad
   const data = await fetch('https://api.example.com')

   // ✅ Good
   const data = yield context.df.callActivity('fetchFromApi')
   ```

3. **Don't forget to purge completed instances**
   - History can grow large
   - Implement cleanup strategy

## Debugging Tips

### Enable Verbose Logging

In `host.json`:

```json
{
  "logging": {
    "logLevel": {
      "DurableTask.Core": "Information",
      "DurableTask.AzureStorage": "Warning"
    }
  }
}
```

### View Orchestration Replay

Orchestrators can execute multiple times (replay). Add logging:

```typescript
if (!context.df.isReplaying) {
  context.log('This only logs on first execution, not replays')
}
```

### Check Storage Queues

If orchestrations aren't progressing:

1. Check control queue messages
2. Check work items queue
3. Look for poison messages (failed activities)

## Next Steps

1. **Explore the code**:
   - [`src/functions/orchestrators.ts`](typescript-node-azfunc-v4-durable/src/functions/orchestrators.ts) - Workflow definitions
   - [`src/functions/activities.ts`](typescript-node-azfunc-v4-durable/src/functions/activities.ts) - Work units
   - [`src/functions/clients.ts`](typescript-node-azfunc-v4-durable/src/functions/clients.ts) - HTTP starters

2. **Create your own orchestration**:
   - Add a new orchestrator function
   - Define required activities
   - Register in `src/index.ts`
   - Create HTTP starter

3. **Deploy to Azure**:
   - See main [`README.md`](typescript-node-azfunc-v4-durable/README.md) for deployment instructions

4. **Read the docs**:
   - [Durable Functions Overview](https://learn.microsoft.com/azure/azure-functions/durable/)
   - [Orchestration Patterns](https://learn.microsoft.com/azure/azure-functions/durable/durable-functions-overview)

## Troubleshooting

### "Cannot read property 'df' of undefined"

**Cause**: Missing `df.input.durableClient()` in HTTP function registration

**Fix**: Ensure client functions include:

```typescript
app.http('myFunction', {
  extraInputs: [df.input.durableClient()],
  handler: myHandler
})
```

### Orchestration stuck in "Running" state

**Possible causes**:

1. Activity function threw an exception
2. Infinite loop in orchestrator
3. Waiting for event that never arrives

**Fix**: Check logs, add timeouts to events

### "Storage connection string not found"

**Cause**: Missing `AzureWebJobsStorage` configuration

**Fix**: Ensure `local.settings.json` exists with correct settings

### Can't connect to Azurite

**Cause**: Docker not running or Azurite not started

**Fix**:

```bash
docker-compose up -d
docker-compose logs azurite
```

## Summary

You now have a complete Durable Functions project with:

- ✅ **4 Orchestration Patterns**: Chaining, Fan-out/Fan-in, Human Interaction, Monitor
- ✅ **7 Activity Functions**: Ready to use and customize
- ✅ **Task Hub Configuration**: Properly configured for local and production
- ✅ **HTTP Endpoints**: For starting and managing orchestrations
- ✅ **Tests**: Example unit tests for orchestrators and activities
- ✅ **Docker Support**: Local storage emulation with Azurite

Happy orchestrating! 🎉
