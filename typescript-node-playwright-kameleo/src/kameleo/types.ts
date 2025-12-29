import type {
  FingerprintPreview,
  CreateProfileRequest,
  ProfileResponse
} from '@kameleo/local-api-client'

/**
 * Configuration for Kameleo LocalAPI connection
 */
export interface KameleoConfig {
  /** Base URL for Kameleo LocalAPI (default: http://localhost:5050) */
  baseUrl: string
  /** Port for Kameleo LocalAPI (default: 5050) */
  port: number
  /** Default browser type to use */
  defaultBrowserType: 'chrome' | 'firefox'
  /** Default fingerprint platform */
  defaultPlatform: 'desktop' | 'mobile'
  /** Ignore HTTPS certificate errors (default: false) */
  ignoreHTTPSErrors?: boolean
}

/**
 * Options for searching fingerprints
 */
export interface FingerprintSearchOptions {
  /** Platform to search for (desktop or mobile) */
  platform: 'desktop' | 'mobile'
  /** Device type for mobile fingerprints */
  device?: string
  /** Browser type (chrome or firefox) */
  browser?: string
  /** Operating system family (windows, macos, linux, android, ios) */
  osFamily?: string
  /** Specific browser version for more precise matching */
  browserVersion?: string
}

/**
 * Options for creating and launching a browser profile
 */
export interface BrowserLaunchOptions {
  /** Name for the profile */
  name?: string
  /** Browser type (chrome or firefox) */
  browserType?: 'chrome' | 'firefox'
  /** Platform (desktop or mobile) */
  platform?: 'desktop' | 'mobile'
  /** Device type for mobile */
  device?: string
}

/**
 * Result of launching a browser with Kameleo
 */
export interface BrowserLaunchResult {
  /** The created profile */
  profile: ProfileResponse
  /** WebSocket endpoint for Playwright connection */
  wsEndpoint: string
  /** Profile ID for cleanup */
  profileId: string
}

/**
 * Re-export Kameleo SDK types for convenience
 */
export type { FingerprintPreview, CreateProfileRequest, ProfileResponse }
