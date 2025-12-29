import { config } from '@/config/'

describe('Config', () => {
  it('should have appName', () => {
    expect(config.appName).toBe('typescript-playwright-scraper')
  })

  it('should have version', () => {
    expect(config.version).toBe('0.1.0')
  })

  it('should have scraper configuration', () => {
    expect(config.scraper).toBeDefined()
    expect(config.scraper.url).toBe('https://quotes.toscrape.com/')
    expect(config.scraper.headless).toBe(true)
    expect(config.scraper.timeout).toBe(30000)
    expect(config.scraper.retries).toBe(3)
  })

  it('should have valid selectors', () => {
    expect(config.scraper.selectors).toBeDefined()
    expect(config.scraper.selectors.container).toBe('.quote')
    expect(config.scraper.selectors.title).toBe('.text')
    expect(config.scraper.selectors.author).toBe('.author')
    expect(config.scraper.selectors.tags).toBe('.tag')
  })

  it('should have output path configured', () => {
    expect(config.scraper.outputPath).toBe('data/scraped-data.json')
  })
})
