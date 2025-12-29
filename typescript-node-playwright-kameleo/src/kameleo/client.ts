import { KameleoLocalApiClient } from '@kameleo/local-api-client'
import type {
  FingerprintPreview,
  CreateProfileRequest,
  ProfileResponse,
  BrowserSettings
} from '@kameleo/local-api-client'
import { logger } from '@/utils/logger'
import type { KameleoConfig, FingerprintSearchOptions } from './types'

/**
 * Wrapper class for Kameleo LocalAPI client with enhanced error handling and logging
 */
export class KameleoClientWrapper {
  private client: KameleoLocalApiClient

  /**
   * Create a new KameleoClientWrapper instance
   * @param config - Kameleo configuration
   */
  constructor(config: KameleoConfig) {
    this.client = new KameleoLocalApiClient({
      basePath: config.baseUrl
    })

    logger.info(`Kameleo client initialized at ${config.baseUrl}`)
  }

  /**
   * Search for fingerprints matching the given criteria
   * @param options - Search options for fingerprints
   * @returns Array of matching fingerprints
   */
  async searchFingerprints(options: FingerprintSearchOptions): Promise<FingerprintPreview[]> {
    try {
      logger.info(`Searching for ${options.platform} fingerprints...`, options)

      const deviceType = options.device || options.platform
      const browserProduct = options.browser || 'chrome'
      const osFamily: string | undefined = options.osFamily
      const browserVersion: string | undefined = options.browserVersion

      const fingerprints = await this.client.fingerprint.searchFingerprints(
        deviceType,
        osFamily,
        browserProduct,
        browserVersion
      )

      logger.info(`Found ${fingerprints.length} fingerprints`)
      return fingerprints
    } catch (error) {
      const err = error as Error
      logger.error(`Failed to search fingerprints: ${err.message}`)
      throw new Error(`Fingerprint search failed: ${err.message}`)
    }
  }

  /**
   * Create a new browser profile with the specified configuration
   * @param request - Profile creation request
   * @returns Created profile
   */
  async createProfile(request: CreateProfileRequest): Promise<ProfileResponse> {
    try {
      logger.info('Creating new Kameleo profile...', {
        name: request.name,
        fingerprintId: request.fingerprintId
      })

      const profile = await this.client.profile.createProfile(request)

      logger.info(`Profile created with ID: ${profile.id}`)
      return profile
    } catch (error) {
      const err = error as Error
      logger.error(`Failed to create profile: ${err.message}`)
      throw new Error(`Profile creation failed: ${err.message}`)
    }
  }

  /**
   * Start a browser profile with optional browser settings
   * @param profileId - ID of the profile to start
   * @param browserSettings - Optional browser settings (e.g., arguments for muting audio)
   */
  async startProfile(profileId: string, browserSettings?: BrowserSettings): Promise<void> {
    try {
      logger.info(`Starting profile ${profileId}...`, browserSettings)

      await this.client.profile.startProfile(profileId, browserSettings)

      logger.info(`Profile ${profileId} started successfully`)
    } catch (error) {
      const err = error as Error
      logger.error(`Failed to start profile ${profileId}: ${err.message}`)
      throw new Error(`Profile start failed: ${err.message}`)
    }
  }

  /**
   * Stop a running browser profile (required to persist state)
   * @param profileId - ID of the profile to stop
   */
  async stopProfile(profileId: string): Promise<void> {
    try {
      logger.info(`Stopping profile ${profileId}...`)

      await this.client.profile.stopProfile(profileId)

      logger.info(`Profile ${profileId} stopped successfully`)
    } catch (error) {
      const err = error as Error
      logger.error(`Failed to stop profile ${profileId}: ${err.message}`)
      throw new Error(`Profile stop failed: ${err.message}`)
    }
  }

  /**
   * Delete a browser profile
   * @param profileId - ID of the profile to delete
   */
  async deleteProfile(profileId: string): Promise<void> {
    try {
      logger.info(`Deleting profile ${profileId}...`)

      await this.client.profile.deleteProfile(profileId)

      logger.info(`Profile ${profileId} deleted successfully`)
    } catch (error) {
      const err = error as Error
      logger.error(`Failed to delete profile ${profileId}: ${err.message}`)
      // Don't throw error to allow cleanup to continue
      logger.warn(`Continuing despite deletion failure`)
    }
  }

  /**
   * Cleanup all resources (stop and delete profile)
   * @param profileId - ID of the profile to cleanup
   */
  async cleanup(profileId: string): Promise<void> {
    logger.info(`Cleaning up profile ${profileId}...`)

    await this.stopProfile(profileId)

    await this.deleteProfile(profileId)

    logger.info(`Profile ${profileId} cleanup complete`)
  }
}
