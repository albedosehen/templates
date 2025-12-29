import type { KameleoConfig } from '@/kameleo/types'

/**
 * Example automation task configuration
 */
export interface AutomationConfig {
  /** URL to navigate to */
  url: string
  /** Timeout for operations in milliseconds */
  timeout: number
  /** Number of retries for failed operations */
  retries: number
}

/**
 * Application configuration
 */
export interface AppConfig {
  /** Application name */
  appName: string
  /** Application version */
  version: string
  /** Kameleo configuration */
  kameleo: KameleoConfig
  /** Automation task configuration */
  automation: AutomationConfig
}

/**
 * Re-export Kameleo types for convenience
 */
export type {
  KameleoConfig,
  FingerprintSearchOptions,
  BrowserLaunchOptions,
  BrowserLaunchResult,
  FingerprintPreview,
  CreateProfileRequest,
  ProfileResponse
} from '@/kameleo/types'
