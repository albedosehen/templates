import { KameleoClientWrapper } from '@/kameleo/client'
import type { KameleoConfig } from '@/kameleo/types'

// Create mock outside describe block so it can be accessed by all tests
const mockApiClient = {
  fingerprint: {
    searchFingerprints: jest.fn()
  },
  profile: {
    createProfile: jest.fn(),
    startProfile: jest.fn(),
    stopProfile: jest.fn(),
    deleteProfile: jest.fn()
  }
}

// Mock the Kameleo SDK
jest.mock('@kameleo/local-api-client', () => ({
  KameleoLocalApiClient: jest.fn().mockImplementation(() => mockApiClient)
}))

describe('KameleoClientWrapper', () => {
  let kameleoClient: KameleoClientWrapper
  const testConfig: KameleoConfig = {
    baseUrl: 'http://localhost:5050',
    port: 5050,
    defaultBrowserType: 'chrome',
    defaultPlatform: 'desktop'
  }

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    kameleoClient = new KameleoClientWrapper(testConfig)
  })

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      // The constructor should be called with basePath
      const { KameleoLocalApiClient } = jest.requireMock('@kameleo/local-api-client')
      expect(KameleoLocalApiClient).toHaveBeenCalledWith({
        basePath: testConfig.baseUrl
      })
    })
  })

  describe('searchFingerprints', () => {
    it('should search for fingerprints successfully', async () => {
      const mockFingerprints = [
        { id: 'fp1', userAgent: 'Mozilla...' },
        { id: 'fp2', userAgent: 'Mozilla...' }
      ]

      mockApiClient.fingerprint.searchFingerprints.mockResolvedValue(mockFingerprints)

      const result = await kameleoClient.searchFingerprints({
        platform: 'desktop',
        browser: 'chrome'
      })

      expect(mockApiClient.fingerprint.searchFingerprints).toHaveBeenCalledWith(
        'desktop',
        undefined,
        'chrome',
        undefined
      )
      expect(result).toEqual(mockFingerprints)
    })

    it('should search with optional osFamily and browserVersion parameters', async () => {
      const mockFingerprints = [{ id: 'fp1', userAgent: 'Mozilla...' }]

      mockApiClient.fingerprint.searchFingerprints.mockResolvedValue(mockFingerprints)

      const result = await kameleoClient.searchFingerprints({
        platform: 'desktop',
        browser: 'chrome',
        osFamily: 'windows',
        browserVersion: '120.0'
      })

      expect(mockApiClient.fingerprint.searchFingerprints).toHaveBeenCalledWith(
        'desktop',
        'windows',
        'chrome',
        '120.0'
      )
      expect(result).toEqual(mockFingerprints)
    })

    it('should throw error when search fails', async () => {
      mockApiClient.fingerprint.searchFingerprints.mockRejectedValue(new Error('API Error'))

      await expect(kameleoClient.searchFingerprints({ platform: 'desktop' })).rejects.toThrow(
        'Fingerprint search failed: API Error'
      )
    })
  })

  describe('createProfile', () => {
    it('should create profile successfully', async () => {
      const mockProfile = {
        id: 'profile-123',
        name: 'Test Profile'
      }

      const createRequest = {
        fingerprintId: 'fp-1',
        name: 'Test Profile'
      }

      mockApiClient.profile.createProfile.mockResolvedValue(mockProfile)

      const result = await kameleoClient.createProfile(createRequest as never)

      expect(mockApiClient.profile.createProfile).toHaveBeenCalledWith(createRequest)
      expect(result).toEqual(mockProfile)
    })
  })

  describe('startProfile', () => {
    it('should start profile successfully', async () => {
      mockApiClient.profile.startProfile.mockResolvedValue(undefined)

      await kameleoClient.startProfile('profile-123')

      expect(mockApiClient.profile.startProfile).toHaveBeenCalledWith('profile-123', undefined)
    })

    it('should start profile with browser settings', async () => {
      mockApiClient.profile.startProfile.mockResolvedValue(undefined)

      const browserSettings = { arguments: ['mute-audio'] }
      await kameleoClient.startProfile('profile-123', browserSettings)

      expect(mockApiClient.profile.startProfile).toHaveBeenCalledWith(
        'profile-123',
        browserSettings
      )
    })
  })

  describe('stopProfile', () => {
    it('should stop profile successfully', async () => {
      mockApiClient.profile.stopProfile.mockResolvedValue(undefined)

      await kameleoClient.stopProfile('profile-123')

      expect(mockApiClient.profile.stopProfile).toHaveBeenCalledWith('profile-123')
    })
  })

  describe('deleteProfile', () => {
    it('should delete profile successfully', async () => {
      mockApiClient.profile.deleteProfile.mockResolvedValue(undefined)

      await kameleoClient.deleteProfile('profile-123')

      expect(mockApiClient.profile.deleteProfile).toHaveBeenCalledWith('profile-123')
    })
  })

  describe('cleanup', () => {
    it('should stop and delete profile successfully', async () => {
      mockApiClient.profile.stopProfile.mockResolvedValue(undefined)
      mockApiClient.profile.deleteProfile.mockResolvedValue(undefined)

      await kameleoClient.cleanup('profile-123')

      expect(mockApiClient.profile.stopProfile).toHaveBeenCalledWith('profile-123')
      expect(mockApiClient.profile.deleteProfile).toHaveBeenCalledWith('profile-123')
    })
  })
})
