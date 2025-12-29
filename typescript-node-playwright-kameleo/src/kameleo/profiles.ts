import type { CreateProfileRequest, BrowserSettings } from '@kameleo/local-api-client'
import type { Browser, BrowserContext } from 'playwright'
import { chromium, firefox } from 'playwright'
import { logger } from '@/utils/logger'
import type { KameleoClientWrapper } from './client'
import type { BrowserLaunchOptions, BrowserLaunchResult, KameleoConfig } from './types'

/**
 * Manager for creating and managing Kameleo browser profiles
 */
export class ProfileManager {
  /**
   * Create a new ProfileManager instance
   * @param client - KameleoClientWrapper instance
   * @param config - Kameleo configuration for WebSocket endpoint generation
   */
  constructor(
    private readonly client: KameleoClientWrapper,
    private readonly config: KameleoConfig
  ) {}

  /**
   * Create and launch a browser with Kameleo spoofed fingerprint
   * @param options - Browser launch options
   * @returns Browser launch result with profile and WebSocket endpoint
   */
  async createAndLaunchBrowser(options: BrowserLaunchOptions = {}): Promise<BrowserLaunchResult> {
    const {
      name = `kameleo-profile-${Date.now()}`,
      browserType = 'chrome',
      platform = 'desktop'
    } = options

    try {
      logger.info('Creating and launching Kameleo browser...', {
        name,
        browserType,
        platform
      })

      const fingerprints = await this.client.searchFingerprints({
        platform,
        browser: browserType
      })

      if (fingerprints.length === 0) {
        throw new Error('No matching fingerprints found')
      }

      // Use the first matching fingerprint
      const fingerprint = fingerprints[0]
      logger.info(`Selected fingerprint ID: ${fingerprint.id}`)

      // Create profile using fingerprintId
      const profileRequest: CreateProfileRequest = {
        fingerprintId: fingerprint.id,
        name
      }

      const profile = await this.client.createProfile(profileRequest)

      // Start the profile with optional browser settings
      // BrowserSettings has 'arguments' property (note: not 'args')
      const browserArgs = ['mute-audio']

      // Add certificate error bypass if configured
      if (this.config.ignoreHTTPSErrors) {
        browserArgs.push('--ignore-certificate-errors')
        logger.info(
          'HTTPS certificate errors will be ignored (--ignore-certificate-errors enabled)'
        )
      }

      const browserSettings: BrowserSettings = {
        arguments: browserArgs
      }
      await this.client.startProfile(profile.id, browserSettings)

      const playwrightWebsocketEndpoint = `ws://localhost:${this.config.port}/playwright/${profile.id}`

      logger.info(`Browser ready at WebSocket endpoint: ${playwrightWebsocketEndpoint}`)

      return {
        profile,
        wsEndpoint: playwrightWebsocketEndpoint,
        profileId: profile.id
      }
    } catch (error) {
      const err = error as Error
      logger.error(`Failed to create and launch browser: ${err.message}`)
      throw new Error(`Browser launch failed: ${err.message}`)
    }
  }

  /**
   * Connect to Kameleo browser via Playwright CDP
   * @param wsEndpoint - WebSocket endpoint from browser launch
   * @param browserType - Browser type (chrome or firefox)
   * @returns Playwright Browser instance
   */
  async connectToBrowser(
    wsEndpoint: string,
    browserType: 'chrome' | 'firefox' = 'chrome'
  ): Promise<Browser> {
    try {
      logger.info(`Connecting to browser via CDP: ${wsEndpoint}`)

      // Connect to the browser using CDP
      const browser =
        browserType === 'firefox'
          ? await firefox.connectOverCDP(wsEndpoint)
          : await chromium.connectOverCDP(wsEndpoint)

      logger.info('Successfully connected to browser via CDP')
      return browser
    } catch (error) {
      const err = error as Error
      logger.error(`Failed to connect to browser: ${err.message}`)
      throw new Error(`Browser connection failed: ${err.message}`)
    }
  }

  /**
   * Get the default browser context from Kameleo browser
   * IMPORTANT: Use browser.contexts()[0] - one browser context per profile
   * @param browser - Playwright Browser instance
   * @returns BrowserContext
   */
  getBrowserContext(browser: Browser): BrowserContext {
    const contexts = browser.contexts()

    if (contexts.length === 0) {
      throw new Error('No browser contexts available')
    }

    // Kameleo: Always use the first (and only) context
    logger.info('Retrieved default browser context')
    return contexts[0]
  }

  /**
   * Cleanup profile resources (stop and delete)
   * @param profileId - Profile ID to cleanup
   */
  async cleanup(profileId: string): Promise<void> {
    await this.client.cleanup(profileId)
  }
}
