import { OrchestrationContext, OrchestrationHandler } from 'durable-functions'

/**
 * Simple sequential orchestrator demonstrating function chaining pattern
 * Calls activities in sequence, passing output of one as input to the next
 */
export const helloOrchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
  const outputs: string[] = []
  const input = String(context.df.getInput() ?? 'World')

  // Function chaining pattern - sequential execution
  outputs.push((yield context.df.callActivity('sayHello', `${input} - Tokyo`)) as string)
  outputs.push((yield context.df.callActivity('sayHello', `${input} - Seattle`)) as string)
  outputs.push((yield context.df.callActivity('sayHello', `${input} - London`)) as string)

  return outputs
}

/**
 * Fan-out/Fan-in orchestrator demonstrating parallel execution pattern
 * Processes multiple items in parallel and aggregates results
 */
export const fanOutFanInOrchestrator: OrchestrationHandler = function* (
  context: OrchestrationContext
) {
  // Get work batch
  const workBatch = (yield context.df.callActivity('getWorkBatch')) as string[]

  // Fan-out: Start parallel activities
  const parallelTasks = workBatch.map((item) => context.df.callActivity('processItem', item))

  // Fan-in: Wait for all to complete
  const results = (yield context.df.Task.all(parallelTasks)) as string[]

  // Aggregate and return
  return {
    processedCount: results.length,
    results: results
  }
}

/**
 * Human interaction pattern with timeout
 * Waits for external event with a timeout fallback
 */
export const approvalOrchestrator: OrchestrationHandler = function* (
  context: OrchestrationContext
) {
  const input = context.df.getInput()

  // Wait for approval event or timeout after 1 hour
  const approvalEvent = context.df.waitForExternalEvent('ApprovalEvent')
  const timeoutTask = context.df.createTimer(
    new Date(context.df.currentUtcDateTime.getTime() + 60 * 60 * 1000)
  ) // 1 hour

  const winner = (yield context.df.Task.any([approvalEvent, timeoutTask])) as unknown

  if (winner === approvalEvent) {
    // Approval received
    const approved = (yield approvalEvent) as boolean
    if (approved) {
      yield context.df.callActivity('processApproval', input)
      return { status: 'approved', input }
    } else {
      return { status: 'rejected', input }
    }
  } else {
    // Timeout occurred
    return { status: 'timeout', input }
  }
}

/**
 * Monitor pattern - checks status periodically
 * Useful for polling external services or monitoring conditions
 */
export const monitorOrchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
  const input = context.df.getInput()
  const { jobId, maxRetries = 10 } = input as { jobId: string; maxRetries?: number }
  let retryCount = 0

  while (retryCount < maxRetries) {
    // Check job status
    const status = (yield context.df.callActivity('checkJobStatus', jobId)) as string

    if (status === 'completed') {
      return { status: 'completed', jobId, retries: retryCount }
    }

    if (status === 'failed') {
      return { status: 'failed', jobId, retries: retryCount }
    }

    // Wait for 30 seconds before checking again
    const nextCheck = new Date(context.df.currentUtcDateTime.getTime() + 30 * 1000)
    yield context.df.createTimer(nextCheck)

    retryCount++
  }

  return { status: 'timeout', jobId, retries: retryCount }
}
