export interface ScraperConfig {
  url: string
  headless: boolean
  timeout: number
  retries: number
  outputPath: string
  selectors: {
    container: string
    title: string
    author: string
    tags?: string
  }
}

export interface ScrapedQuote {
  text: string
  author: string
  tags: string[]
}

export interface ScrapedData {
  timestamp: string
  url: string
  quotes: ScrapedQuote[]
  totalCount: number
}

export interface AppConfig {
  appName: string
  version: string
  scraper: ScraperConfig
}
