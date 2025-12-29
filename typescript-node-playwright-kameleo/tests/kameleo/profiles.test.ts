import { chromium, firefox, type Browser, type BrowserContext } from 'playwright'
import { KameleoClientWrapper } from '@/kameleo/client'
import { ProfileManager } from '@/kameleo/profiles'
import type { KameleoConfig } from '@/kameleo/types'

// Mock dependencies
jest.mock('@/kameleo/client')
jest.mock('playwright', () => ({
  chromium: {
    connectOverCDP: jest.fn()
  },
  firefox: {
    connectOverCDP: jest.fn()
  }
}))

describe('ProfileManager', () => {
  let profileManager: ProfileManager
  let mockClient: jest.Mocked<KameleoClientWrapper>
  let mockBrowser: jest.Mocked<Browser>
  let mockContext: jest.Mocked<BrowserContext>
  const testConfig: KameleoConfig = {
    baseUrl: 'http://localhost:5050',
    port: 5050,
    defaultBrowserType: 'chrome',
    defaultPlatform: 'desktop'
  }

  beforeEach(() => {
    // Create mock client
    mockClient = {
      searchFingerprints: jest.fn(),
      createProfile: jest.fn(),
      startProfile: jest.fn(),
      stopProfile: jest.fn(),
      cleanup: jest.fn()
    } as unknown as jest.Mocked<KameleoClientWrapper>

    // Create mock browser and context
    mockContext = {} as jest.Mocked<BrowserContext>
    mockBrowser = {
      close: jest.fn(),
      contexts: jest.fn().mockReturnValue([mockContext])
    } as unknown as jest.Mocked<Browser>

    profileManager = new ProfileManager(mockClient, testConfig)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createAndLaunchBrowser', () => {
    it('should create and launch browser with default options', async () => {
      const mockFingerprints = [{ id: 'fp1', userAgent: 'Mozilla...', version: 'v1' }]
      const mockProfile = { id: 'profile-123', name: 'test-profile' }

      mockClient.searchFingerprints.mockResolvedValue(mockFingerprints as never)
      mockClient.createProfile.mockResolvedValue(mockProfile as never)
      mockClient.startProfile.mockResolvedValue(undefined)

      const result = await profileManager.createAndLaunchBrowser()

      expect(mockClient.searchFingerprints).toHaveBeenCalled()
      expect(mockClient.createProfile).toHaveBeenCalled()
      expect(mockClient.startProfile).toHaveBeenCalledWith('profile-123', {
        arguments: ['mute-audio']
      })
      expect(result.profileId).toBe('profile-123')
      expect(result.wsEndpoint).toBe('ws://localhost:5050/playwright/profile-123')
    })

    it('should throw error when no fingerprints found', async () => {
      mockClient.searchFingerprints.mockResolvedValue([])

      await expect(profileManager.createAndLaunchBrowser()).rejects.toThrow(
        'Browser launch failed: No matching fingerprints found'
      )
    })
  })

  describe('connectToBrowser', () => {
    it('should connect to Chrome browser via CDP', async () => {
      const wsEndpoint = 'ws://localhost:5050/playwright/profile-123'

      ;(chromium.connectOverCDP as jest.Mock).mockResolvedValue(mockBrowser)

      const result = await profileManager.connectToBrowser(wsEndpoint, 'chrome')

      expect(chromium.connectOverCDP).toHaveBeenCalledWith(wsEndpoint)
      expect(result).toBe(mockBrowser)
    })

    it('should connect to Firefox browser via CDP', async () => {
      const wsEndpoint = 'ws://localhost:5050/playwright/profile-456'

      ;(firefox.connectOverCDP as jest.Mock).mockResolvedValue(mockBrowser)

      const result = await profileManager.connectToBrowser(wsEndpoint, 'firefox')

      expect(firefox.connectOverCDP).toHaveBeenCalledWith(wsEndpoint)
      expect(result).toBe(mockBrowser)
    })
  })

  describe('getBrowserContext', () => {
    it('should return first browser context', () => {
      const context = profileManager.getBrowserContext(mockBrowser)

      expect(mockBrowser.contexts).toHaveBeenCalled()
      expect(context).toBe(mockContext)
    })

    it('should throw error when no contexts available', () => {
      mockBrowser.contexts = jest.fn().mockReturnValue([])

      expect(() => profileManager.getBrowserContext(mockBrowser)).toThrow(
        'No browser contexts available'
      )
    })
  })

  describe('cleanup', () => {
    it('should call client cleanup', async () => {
      mockClient.cleanup.mockResolvedValue(undefined)

      await profileManager.cleanup('profile-123')

      expect(mockClient.cleanup).toHaveBeenCalledWith('profile-123')
    })
  })
})
