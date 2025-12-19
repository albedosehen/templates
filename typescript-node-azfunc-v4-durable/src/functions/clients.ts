import { HttpRequest, HttpResponse, HttpResponseInit, InvocationContext } from '@azure/functions'
import * as df from 'durable-functions'

/**
 * HTTP starter for the hello orchestrator
 * Starts a new orchestration instance with optional name parameter
 */
export const httpStartHello = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponse> => {
  const client = df.getClient(context)
  const instanceId = await client.startNew('helloOrchestrator', {
    input: request.query.get('name') || 'World'
  })

  context.log(`Started orchestration with ID = '${instanceId}'`)
  return client.createCheckStatusResponse(request, instanceId)
}

/**
 * HTTP starter for fan-out/fan-in orchestrator
 * Demonstrates parallel processing pattern
 */
export const httpStartFanOut = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponse> => {
  const client = df.getClient(context)
  const instanceId = await client.startNew('fanOutFanInOrchestrator')

  context.log(`Started fan-out/fan-in orchestration with ID = '${instanceId}'`)
  return client.createCheckStatusResponse(request, instanceId)
}

/**
 * HTTP starter for approval orchestrator
 * Demonstrates human interaction pattern
 */
export const httpStartApproval = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponse> => {
  const client = df.getClient(context)

  let input: unknown
  try {
    const body = await request.text()
    input = body ? JSON.parse(body) : {}
  } catch {
    input = {}
  }

  const instanceId = await client.startNew('approvalOrchestrator', { input })

  context.log(`Started approval orchestration with ID = '${instanceId}'`)
  return client.createCheckStatusResponse(request, instanceId)
}

/**
 * HTTP endpoint to raise an event to a running orchestration
 * Used for human interaction pattern
 */
export const httpRaiseEvent = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  const client = df.getClient(context)
  const instanceId = request.params.instanceId
  const eventName = request.query.get('eventName') || 'ApprovalEvent'

  let eventData: unknown
  try {
    const body = await request.text()
    eventData = body ? JSON.parse(body) : true
  } catch {
    eventData = true
  }

  await client.raiseEvent(instanceId, eventName, eventData)

  context.log(`Raised event '${eventName}' to orchestration '${instanceId}'`)

  return {
    status: 200,
    jsonBody: {
      message: `Event '${eventName}' raised successfully`,
      instanceId,
      eventData
    }
  }
}

/**
 * HTTP starter for monitor orchestrator
 * Demonstrates polling/monitoring pattern
 */
export const httpStartMonitor = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponse> => {
  const client = df.getClient(context)

  const jobId = request.query.get('jobId') || `job-${Date.now()}`
  const maxRetries = parseInt(request.query.get('maxRetries') || '10', 10)

  const instanceId = await client.startNew('monitorOrchestrator', {
    input: { jobId, maxRetries }
  })

  context.log(`Started monitor orchestration with ID = '${instanceId}' for job '${jobId}'`)
  return client.createCheckStatusResponse(request, instanceId)
}

/**
 * Get status of a running orchestration
 */
export const httpGetStatus = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  const client = df.getClient(context)
  const instanceId = request.params.instanceId

  const status = await client.getStatus(instanceId)

  if (!status) {
    return {
      status: 404,
      jsonBody: {
        error: `Orchestration instance '${instanceId}' not found`
      }
    }
  }

  return {
    status: 200,
    jsonBody: status
  }
}

/**
 * Terminate a running orchestration
 */
export const httpTerminate = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  const client = df.getClient(context)
  const instanceId = request.params.instanceId
  const reason = request.query.get('reason') || 'User requested termination'

  await client.terminate(instanceId, reason)

  context.log(`Terminated orchestration '${instanceId}' with reason: ${reason}`)

  return {
    status: 200,
    jsonBody: {
      message: 'Orchestration terminated successfully',
      instanceId,
      reason
    }
  }
}

/**
 * Purge orchestration history (clean up)
 */
export const httpPurge = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  const client = df.getClient(context)
  const instanceId = request.params.instanceId

  await client.purgeInstanceHistory(instanceId)

  context.log(`Purged history for orchestration '${instanceId}'`)

  return {
    status: 200,
    jsonBody: {
      message: 'Orchestration history purged successfully',
      instanceId
    }
  }
}
