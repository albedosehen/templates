import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { config } from '@/config/'
import type { AppConfig } from '@/types'

const appConfig: AppConfig = config

// Example HTTP trigger function
export async function httpTrigger(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`HTTP function processed request for url "${request.url}"`)

  const name = request.query.get('name') || (await request.text()) || 'world'

  return {
    status: 200,
    jsonBody: {
      message: `Hello, ${name}!`,
      appName: appConfig.appName,
      version: appConfig.version,
      timestamp: new Date().toISOString()
    }
  }
}

// Register the function with Azure Functions v4 programming model
app.http('httpTrigger', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'hello',
  handler: httpTrigger
})

// Health check endpoint
export function healthCheck(request: HttpRequest, context: InvocationContext): HttpResponseInit {
  context.log('Health check requested')

  return {
    status: 200,
    jsonBody: {
      status: 'healthy',
      appName: appConfig.appName,
      version: appConfig.version
    }
  }
}

app.http('healthCheck', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'health',
  handler: healthCheck
})
