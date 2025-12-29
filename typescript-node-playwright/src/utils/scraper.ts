import { promises as fs } from 'fs'
import { dirname } from 'path'
import { chromium, type Browser, type Page } from 'playwright'
import type { ScraperConfig, ScrapedData, ScrapedQuote } from '@/types'
import { logger } from '@/utils/logger'

/**
 * Initialize and launch a Playwright browser instance
 * @param headless - Whether to run browser in headless mode
 * @returns Browser instance
 */
export async function initializeBrowser(headless: boolean = true): Promise<Browser> {
  logger.info('Initializing browser...')
  const browser = await chromium.launch({
    headless
  })
  logger.info('Browser initialized successfully')
  return browser
}

/**
 * Extract quotes from the page
 * @param page - Playwright page instance
 * @param config - Scraper configuration
 * @returns Array of scraped quotes
 */
async function extractQuotes(page: Page, config: ScraperConfig): Promise<ScrapedQuote[]> {
  logger.info('Extracting quotes from page...')

  const containerElements = page.locator(config.selectors.container)
  const count = await containerElements.count()
  const quotes: ScrapedQuote[] = []

  for (let i = 0; i < count; i++) {
    const container = containerElements.nth(i)

    const textElement = container.locator(config.selectors.title)
    const authorElement = container.locator(config.selectors.author)

    const text = (await textElement.textContent())?.trim() || ''
    const author = (await authorElement.textContent())?.trim() || ''

    const tags: string[] = []
    if (config.selectors.tags) {
      const tagElements = container.locator(config.selectors.tags)
      const tagCount = await tagElements.count()

      for (let j = 0; j < tagCount; j++) {
        const tagText = (await tagElements.nth(j).textContent())?.trim()
        if (tagText) {
          tags.push(tagText)
        }
      }
    }

    if (text && author) {
      quotes.push({ text, author, tags })
    }
  }

  return quotes
}

/**
 * Scrape quotes from the website with retry logic
 * @param config - Scraper configuration
 * @returns Scraped data
 */
export async function scrapeQuotes(config: ScraperConfig): Promise<ScrapedData> {
  let browser: Browser | null = null
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= config.retries; attempt++) {
    try {
      logger.info(`Scraping attempt ${attempt}/${config.retries}`)

      browser = await initializeBrowser(config.headless)
      const page: Page = await browser.newPage()

      await page.setViewportSize({ width: 1280, height: 720 })

      logger.info(`Navigating to ${config.url}`)
      await page.goto(config.url, {
        waitUntil: 'domcontentloaded',
        timeout: config.timeout
      })

      logger.info('Waiting for content to load...')
      await page.waitForSelector(config.selectors.container, { timeout: config.timeout })

      const quotes = await extractQuotes(page, config)

      await browser.close()
      browser = null

      const scrapedData: ScrapedData = {
        timestamp: new Date().toISOString(),
        url: config.url,
        quotes,
        totalCount: quotes.length
      }

      logger.info(`Successfully scraped ${quotes.length} quotes`)
      return scrapedData
    } catch (error) {
      lastError = error as Error
      logger.error(`Attempt ${attempt} failed: ${lastError.message}`)

      if (browser) {
        await browser.close().catch((err) => {
          logger.error(`Error closing browser: ${err}`)
        })
        browser = null
      }

      if (attempt < config.retries) {
        const delay = attempt * 1000
        logger.info(`Retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw new Error(`Failed to scrape after ${config.retries} attempts: ${lastError?.message}`)
}

/**
 * Save scraped data to JSON file
 * @param data - Scraped data to save
 * @param outputPath - Path to output file
 */
export async function saveToJson(data: ScrapedData, outputPath: string): Promise<void> {
  try {
    logger.info(`Saving data to ${outputPath}`)

    const dir = dirname(outputPath)
    await fs.mkdir(dir, { recursive: true })

    const jsonData = JSON.stringify(data, null, 2)
    await fs.writeFile(outputPath, jsonData, 'utf-8')

    logger.info(`Data saved successfully to ${outputPath}`)
  } catch (error) {
    const err = error as Error
    logger.error(`Failed to save data: ${err.message}`)
    throw error
  }
}

/**
 * Main scraping function that orchestrates the entire process
 * @param config - Scraper configuration
 * @returns Scraped data
 */
export async function runScraper(config: ScraperConfig): Promise<ScrapedData> {
  try {
    const data = await scrapeQuotes(config)
    await saveToJson(data, config.outputPath)
    return data
  } catch (error) {
    const err = error as Error
    logger.error(`Scraping failed: ${err.message}`)
    throw error
  }
}
