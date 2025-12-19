import * as df from 'durable-functions'
import {
  app,
  HttpRequest,
  HttpResponse,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions'
import {
  OrchestrationContext,
  OrchestrationHandler,
  ActivityHandler,
} from 'durable-functions'
import { config } from '@/config/'
import type { AppConfig } from '@/types'

const appConfig: AppConfig = config

// ========== HTTP Starter (Client) Function ==========
const httpStart = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponse> => {
  const client = df.getClient(context)
  const instanceId = await client.startNew('helloOrchestrator', {
    input: request.query.get('name') || 'World',
  })

  context.log(`Started orchestration with ID = '${instanceId}'`)
  return client.createCheckStatusResponse(request, instanceId)
}

app.http('httpStart', {
  route: 'orchestrators/hello',
  extraInputs: [df.input.durableClient()],
  handler: httpStart,
})

// ========== Orchestrator Function ==========
const helloOrchestrator: OrchestrationHandler = function* (
  context: OrchestrationContext
) {
  const outputs = []
  const input = context.df.getInput()

  // Function chaining pattern - sequential execution
  outputs.push(yield context.df.callActivity('sayHello', `${input} - Tokyo`))
  outputs.push(yield context.df.callActivity('sayHello', `${input} - Seattle`))
  outputs.push(yield context.df.callActivity('sayHello', `${input} - London`))

  return outputs
}

df.app.orchestration('helloOrchestrator', helloOrchestrator)

// ========== Fan-out/Fan-in Orchestrator ==========
const fanOutFanInOrchestrator: OrchestrationHandler = function* (
  context: OrchestrationContext
) {
  const parallelTasks = []

  // Get work batch
  const workBatch: string[] = yield context.df.callActivity('getWorkBatch')

  // Fan-out: Start parallel activities
  for (const item of workBatch) {
    parallelTasks.push(context.df.callActivity('processItem', item))
  }

  // Fan-in: Wait for all to complete
  const results: string[] = yield context.df.Task.all(parallelTasks)

  // Aggregate and return
  return {
    processedCount: results.length,
    results: results,
  }
}

df.app.orchestration('fanOutFanInOrchestrator', fanOutFanInOrchestrator)

// HTTP starter for fan-out/fan-in
const httpStartFanOut = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponse> => {
  const client = df.getClient(context)
  const instanceId = await client.startNew('fanOutFanInOrchestrator')

  context.log(`Started fan-out/fan-in orchestration with ID = '${instanceId}'`)
  return client.createCheckStatusResponse(request, instanceId)
}

app.http('httpStartFanOut', {
  route: 'orchestrators/fanout',
  extraInputs: [df.input.durableClient()],
  handler: httpStartFanOut,
})

// ========== Activity Functions ==========
const sayHelloActivity: ActivityHandler = (name: string): string => {
  return `Hello ${name}!`
}

df.app.activity('sayHello', { handler: sayHelloActivity })

const getWorkBatchActivity: ActivityHandler = (): string[] => {
  // Simulate getting a batch of work items
  return ['Item1', 'Item2', 'Item3', 'Item4', 'Item5']
}

df.app.activity('getWorkBatch', { handler: getWorkBatchActivity })

const processItemActivity: ActivityHandler = async (
  item: string
): Promise<string> => {
  // Simulate async processing
  await new Promise((resolve) => setTimeout(resolve, 100))
  return `Processed: ${item}`
}

df.app.activity('processItem', { handler: processItemActivity })

// ========== Health Check ==========
export function healthCheck(
  request: HttpRequest,
  context: InvocationContext
): HttpResponseInit {
  context.log('Health check requested')

  return {
    status: 200,
    jsonBody: {
      status: 'healthy',
      appName: appConfig.appName,
      version: appConfig.version,
      durableFunctions: 'enabled',
    },
  }
}

app.http('healthCheck', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'health',
  handler: healthCheck,
})
