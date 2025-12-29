import { config } from '@/config/'

describe('Scraper', () => {
  describe('Config', () => {
    it('should have valid scraper configuration', () => {
      expect(config.scraper).toBeDefined()
      expect(config.scraper.url).toBe('https://quotes.toscrape.com/')
      expect(config.scraper.headless).toBe(true)
      expect(config.scraper.timeout).toBeGreaterThan(0)
      expect(config.scraper.retries).toBeGreaterThan(0)
    })

    it('should have valid selectors', () => {
      expect(config.scraper.selectors).toBeDefined()
      expect(config.scraper.selectors.container).toBeTruthy()
      expect(config.scraper.selectors.title).toBeTruthy()
      expect(config.scraper.selectors.author).toBeTruthy()
    })

    it('should have valid output path', () => {
      expect(config.scraper.outputPath).toBeTruthy()
      expect(config.scraper.outputPath).toContain('.json')
    })
  })
})
