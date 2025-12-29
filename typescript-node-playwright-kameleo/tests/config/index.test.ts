import { config } from '@/config/'
import type { AppConfig } from '@/types'

describe('Config', () => {
  it('should define application name', () => {
    expect(config.appName).toBe('typescript-playwright-kameleo')
  })

  it('should define version', () => {
    expect(config.version).toBeDefined()
    expect(typeof config.version).toBe('string')
  })

  describe('Kameleo configuration', () => {
    it('should have default Kameleo baseUrl', () => {
      expect(config.kameleo.baseUrl).toBeDefined()
      expect(config.kameleo.baseUrl).toContain('localhost')
    })

    it('should have default Kameleo port', () => {
      expect(config.kameleo.port).toBe(5050)
    })

    it('should have default browser type', () => {
      expect(config.kameleo.defaultBrowserType).toBe('chrome')
    })

    it('should have default fingerprint platform', () => {
      expect(config.kameleo.defaultPlatform).toBe('desktop')
    })
  })

  describe('Automation configuration', () => {
    it('should have default URL', () => {
      expect(config.automation.url).toBeDefined()
      expect(typeof config.automation.url).toBe('string')
    })

    it('should have timeout configuration', () => {
      expect(config.automation.timeout).toBeDefined()
      expect(typeof config.automation.timeout).toBe('number')
      expect(config.automation.timeout).toBeGreaterThan(0)
    })

    it('should have retries configuration', () => {
      expect(config.automation.retries).toBeDefined()
      expect(typeof config.automation.retries).toBe('number')
      expect(config.automation.retries).toBeGreaterThanOrEqual(0)
    })
  })

  it('should conform to AppConfig interface', () => {
    const typedConfig: AppConfig = config
    expect(typedConfig).toBeDefined()
    expect(typedConfig.appName).toBeDefined()
    expect(typedConfig.version).toBeDefined()
    expect(typedConfig.kameleo).toBeDefined()
    expect(typedConfig.automation).toBeDefined()
  })
})
