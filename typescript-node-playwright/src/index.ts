import { config } from '@/config/'
import type { AppConfig } from '@/types'
import { logger } from '@/utils/logger'
import { runScraper } from '@/utils/scraper'

/**
 * Main entry point for the Playwright web scraper application
 */
async function main(): Promise<void> {
  try {
    const appConfig: AppConfig = config

    logger.info('='.repeat(60))
    logger.info(`${appConfig.appName} v${appConfig.version}`)
    logger.info('='.repeat(60))
    logger.info('Starting web scraper...')

    const startTime = Date.now()

    const scrapedData = await runScraper(appConfig.scraper)

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    logger.info('='.repeat(60))
    logger.info('Scraping completed successfully!')
    logger.info(`Total quotes scraped: ${scrapedData.totalCount}`)
    logger.info(`Duration: ${duration}s`)
    logger.info(`Output file: ${appConfig.scraper.outputPath}`)
    logger.info('='.repeat(60))
  } catch (error) {
    const err = error as Error
    logger.error('='.repeat(60))
    logger.error('Scraping failed!')
    logger.error(`Error: ${err.message}`)
    logger.error('='.repeat(60))
    process.exit(1)
  }
}

void main()
