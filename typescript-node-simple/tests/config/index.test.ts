import { config } from '@/config/'

describe('Config', () => {
  it('should have appName', () => {
    expect(config.appName).toBe('app')
  })

  it('should have version', () => {
    expect(config.version).toBe('1.0.0')
  })
})
