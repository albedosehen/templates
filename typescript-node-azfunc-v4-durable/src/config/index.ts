import type { AppConfig } from '@/types'

export const config: AppConfig = {
  appName: process.env.APP_NAME || 'azure-durable-functions-v4-app',
  version: process.env.APP_VERSION || '0.1.0'
}
