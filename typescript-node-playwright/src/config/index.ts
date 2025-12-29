import type { AppConfig } from '@/types'

export const config: AppConfig = {
  appName: 'typescript-playwright-scraper',
  version: '0.1.0',
  scraper: {
    url: 'https://quotes.toscrape.com/',
    headless: true,
    timeout: 30000,
    retries: 3,
    outputPath: 'data/scraped-data.json',
    selectors: {
      container: '.quote',
      title: '.text',
      author: '.author',
      tags: '.tag'
    }
  }
}
