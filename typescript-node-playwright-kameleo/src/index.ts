import { config } from '@/config/'
import { KameleoClientWrapper } from '@/kameleo/client'
import { ProfileManager } from '@/kameleo/profiles'
import type { AppConfig } from '@/types'
import { logger } from '@/utils/logger'

/**
 * Main entry point for the Playwright + Kameleo automation application
 * Demonstrates the complete workflow:
 * 1. Initialize Kameleo client
 * 2. Create and launch browser
 * 3. Connect via Playwright CDP
 * 4. Perform automation tasks
 * 5. Cleanup (stop profile)
 */
async function main(): Promise<void> {
  const appConfig: AppConfig = config
  let profileId: string | null = null

  try {
    logger.info('='.repeat(60))
    logger.info(`${appConfig.appName} v${appConfig.version}`)
    logger.info('='.repeat(60))
    logger.info('Starting Kameleo + Playwright automation...')

    const startTime = Date.now()

    // Initialize Kameleo client
    logger.info('Initializing Kameleo client...')
    const kameleoClient = new KameleoClientWrapper(appConfig.kameleo)

    // Initialize profile manager with config for WebSocket endpoint
    const profileManager = new ProfileManager(kameleoClient, appConfig.kameleo)

    // Create and launch browser
    logger.info('Creating and launching browser...')
    const { wsEndpoint, profileId: createdProfileId } = await profileManager.createAndLaunchBrowser(
      {
        name: `automation-${Date.now()}`,
        browserType: appConfig.kameleo.defaultBrowserType,
        platform: appConfig.kameleo.defaultPlatform
      }
    )

    profileId = createdProfileId

    logger.info('Connecting to browser via Playwright...')
    const browser = await profileManager.connectToBrowser(
      wsEndpoint,
      appConfig.kameleo.defaultBrowserType
    )

    // Get browser context (one context per profile)
    logger.info('Getting browser context...')
    const context = profileManager.getBrowserContext(browser)

    // Create new page and perform automation
    logger.info('Creating new page...')
    const page = await context.newPage()

    logger.info(`Navigating to ${appConfig.automation.url}...`)
    await page.goto(appConfig.automation.url, {
      timeout: appConfig.automation.timeout,
      waitUntil: 'domcontentloaded'
    })

    logger.info('Page loaded successfully')

    // Example: Get page title
    const title = await page.title()
    logger.info(`Page title: ${title}`)

    // Example: Take screenshot
    const screenshotPath = 'data/screenshot.png'
    await page.screenshot({ path: screenshotPath })
    logger.info(`Screenshot saved to ${screenshotPath}`)

    // Example: Get user agent (should be spoofed by Kameleo)
    const userAgent = await page.evaluate(() => navigator.userAgent)
    logger.info(`User agent: ${userAgent}`)

    // Close browser
    logger.info('Closing browser...')
    await browser.close()

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    logger.info('-'.repeat(60))
    logger.info('Automation completed successfully!')
    logger.info(`Duration: ${duration}s`)
    logger.info('-'.repeat(60))
  } catch (error) {
    const err = error as Error
    logger.error('-'.repeat(60))
    logger.error('Automation failed!')
    logger.error(`Error: ${err.message}`)
    logger.error('Stack trace:', err.stack)
    logger.error('-'.repeat(60))
    process.exit(1)
  } finally {
    // Always stop the profile to persist state
    if (profileId) {
      try {
        logger.info('Cleaning up Kameleo profile...')
        const kameleoClient = new KameleoClientWrapper(appConfig.kameleo)
        await kameleoClient.stopProfile(profileId)
        logger.info('Profile stopped successfully')
      } catch (error) {
        const err = error as Error
        logger.error(`Failed to stop profile: ${err.message}`)
      }
    }
  }
}

void main()
