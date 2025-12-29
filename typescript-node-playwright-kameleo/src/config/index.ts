import type { AppConfig } from '@/types'

/**
 * Application configuration
 * Environment variables can be used to override defaults
 */
export const config: AppConfig = {
  appName: 'typescript-playwright-kameleo',
  version: '0.1.0',
  kameleo: {
    baseUrl: process.env.KAMELEO_BASE_URL || 'http://localhost:5050',
    port: parseInt(process.env.KAMELEO_PORT || '5050', 10),
    defaultBrowserType: (process.env.DEFAULT_BROWSER_TYPE as 'chrome' | 'firefox') || 'chrome',
    defaultPlatform:
      (process.env.DEFAULT_FINGERPRINT_PLATFORM as 'desktop' | 'mobile') || 'desktop',
    ignoreHTTPSErrors: process.env.IGNORE_HTTPS_ERRORS === 'true'
  },
  automation: {
    url: process.env.AUTOMATION_URL || 'https://www.etzy.com',
    timeout: parseInt(process.env.AUTOMATION_TIMEOUT || '30000', 10),
    retries: parseInt(process.env.AUTOMATION_RETRIES || '3', 10)
  }
}
