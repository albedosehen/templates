import { config } from '@/config/'

describe('Config', () => {
  it('should have appName', () => {
    expect(config.appName).toBe('typescript-node-app')
  })

  it('should have version', () => {
    expect(config.version).toBe('0.1.0')
  })
})
