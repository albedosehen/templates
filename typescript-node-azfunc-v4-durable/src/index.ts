import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import * as df from 'durable-functions'
import { config } from '@/config/'
import type { AppConfig } from '@/types'

// Import activities
import {
  sayHelloActivity,
  getWorkBatchActivity,
  processItemActivity,
  processApprovalActivity,
  checkJobStatusActivity,
  validateDataActivity,
  sendNotificationActivity
} from './functions/activities'

// Import client functions
import {
  httpStartHello,
  httpStartFanOut,
  httpStartApproval,
  httpStartMonitor,
  httpRaiseEvent,
  httpGetStatus,
  httpTerminate,
  httpPurge
} from './functions/clients'

// Import orchestrators
import {
  helloOrchestrator,
  fanOutFanInOrchestrator,
  approvalOrchestrator,
  monitorOrchestrator
} from './functions/orchestrators'

const appConfig: AppConfig = config

// ========== Register Orchestrators ==========
df.app.orchestration('helloOrchestrator', helloOrchestrator)
df.app.orchestration('fanOutFanInOrchestrator', fanOutFanInOrchestrator)
df.app.orchestration('approvalOrchestrator', approvalOrchestrator)
df.app.orchestration('monitorOrchestrator', monitorOrchestrator)

// ========== Register Activities ==========
df.app.activity('sayHello', { handler: sayHelloActivity })
df.app.activity('getWorkBatch', { handler: getWorkBatchActivity })
df.app.activity('processItem', { handler: processItemActivity })
df.app.activity('processApproval', { handler: processApprovalActivity })
df.app.activity('checkJobStatus', { handler: checkJobStatusActivity })
df.app.activity('validateData', { handler: validateDataActivity })
df.app.activity('sendNotification', { handler: sendNotificationActivity })

// ========== Register HTTP Client Functions ==========

// Start orchestrations
app.http('httpStartHello', {
  route: 'orchestrators/hello',
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  extraInputs: [df.input.durableClient()],
  handler: httpStartHello
})

app.http('httpStartFanOut', {
  route: 'orchestrators/fanout',
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  extraInputs: [df.input.durableClient()],
  handler: httpStartFanOut
})

app.http('httpStartApproval', {
  route: 'orchestrators/approval',
  methods: ['POST'],
  authLevel: 'anonymous',
  extraInputs: [df.input.durableClient()],
  handler: httpStartApproval
})

app.http('httpStartMonitor', {
  route: 'orchestrators/monitor',
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  extraInputs: [df.input.durableClient()],
  handler: httpStartMonitor
})

// Management endpoints
app.http('httpRaiseEvent', {
  route: 'orchestrators/{instanceId}/raiseEvent',
  methods: ['POST'],
  authLevel: 'anonymous',
  extraInputs: [df.input.durableClient()],
  handler: httpRaiseEvent
})

app.http('httpGetStatus', {
  route: 'orchestrators/{instanceId}',
  methods: ['GET'],
  authLevel: 'anonymous',
  extraInputs: [df.input.durableClient()],
  handler: httpGetStatus
})

app.http('httpTerminate', {
  route: 'orchestrators/{instanceId}/terminate',
  methods: ['POST'],
  authLevel: 'anonymous',
  extraInputs: [df.input.durableClient()],
  handler: httpTerminate
})

app.http('httpPurge', {
  route: 'orchestrators/{instanceId}/purge',
  methods: ['DELETE'],
  authLevel: 'anonymous',
  extraInputs: [df.input.durableClient()],
  handler: httpPurge
})

// ========== Health Check ==========
export function healthCheck(request: HttpRequest, context: InvocationContext): HttpResponseInit {
  context.log('Health check requested')

  return {
    status: 200,
    jsonBody: {
      status: 'healthy',
      appName: appConfig.appName,
      version: appConfig.version,
      durableFunctions: 'enabled',
      taskHub: 'MyTaskHub',
      orchestrators: [
        'helloOrchestrator',
        'fanOutFanInOrchestrator',
        'approvalOrchestrator',
        'monitorOrchestrator'
      ],
      activities: [
        'sayHello',
        'getWorkBatch',
        'processItem',
        'processApproval',
        'checkJobStatus',
        'validateData',
        'sendNotification'
      ]
    }
  }
}

app.http('healthCheck', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'health',
  handler: healthCheck
})
