import { InvocationContext } from '@azure/functions'
import {
  sayHelloActivity,
  getWorkBatchActivity,
  processItemActivity,
  processApprovalActivity,
  checkJobStatusActivity,
  validateDataActivity,
  sendNotificationActivity
} from '../../src/functions/activities'

describe('Activities', () => {
  let mockContext: InvocationContext

  beforeEach(() => {
    mockContext = {
      log: jest.fn(),
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    } as unknown as InvocationContext
  })

  describe('sayHelloActivity', () => {
    it('should return greeting message', () => {
      const result = sayHelloActivity('Azure', mockContext)
      expect(result).toBe('Hello Azure!')
    })

    it('should handle empty string', () => {
      const result = sayHelloActivity('', mockContext)
      expect(result).toBe('Hello !')
    })
  })

  describe('getWorkBatchActivity', () => {
    it('should return array of work items', () => {
      const result = getWorkBatchActivity(undefined, mockContext)
      expect(result).toBeInstanceOf(Array)
      expect(result).toHaveLength(5)
      expect(result).toEqual(['Item1', 'Item2', 'Item3', 'Item4', 'Item5'])
    })
  })

  describe('processItemActivity', () => {
    it('should process item with delay', async () => {
      const startTime = Date.now()
      const result = await processItemActivity('TestItem', mockContext)
      const endTime = Date.now()

      expect(result).toBe('Processed: TestItem')
      expect(endTime - startTime).toBeGreaterThanOrEqual(95)
    })

    it('should handle different item types', async () => {
      const result = await processItemActivity('Order-123', mockContext)
      expect(result).toBe('Processed: Order-123')
    })
  })

  describe('processApprovalActivity', () => {
    it('should process approval request', async () => {
      const input = { orderId: '12345', amount: 1000 }
      const result = await processApprovalActivity(input, mockContext)

      expect(result).toContain('Approval processed for:')
      expect(result).toContain('"orderId":"12345"')
    })

    it('should handle various input types', async () => {
      const result = await processApprovalActivity('simple string', mockContext)
      expect(result).toContain('Approval processed for:')
    })
  })

  describe('checkJobStatusActivity', () => {
    it('should return a valid status', async () => {
      const result = await checkJobStatusActivity(undefined, mockContext)

      expect(result).toBeDefined()
      expect(['pending', 'processing', 'completed']).toContain(result)
    })

    it('should simulate delay', async () => {
      const startTime = Date.now()
      await checkJobStatusActivity(undefined, mockContext)
      const endTime = Date.now()

      expect(endTime - startTime).toBeGreaterThanOrEqual(100)
    })
  })

  describe('validateDataActivity', () => {
    it('should return true for valid data', async () => {
      const result = await validateDataActivity({ name: 'Test', value: 123 }, mockContext)
      expect(result).toBe(true)
    })

    it('should return false for null data', async () => {
      const result = await validateDataActivity(null, mockContext)
      expect(result).toBe(false)
    })

    it('should return false for undefined data', async () => {
      const result = await validateDataActivity(undefined, mockContext)
      expect(result).toBe(false)
    })

    it('should return true for any truthy data', async () => {
      const result = await validateDataActivity('some data', mockContext)
      expect(result).toBe(true)
    })
  })

  describe('sendNotificationActivity', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should send notification and return true', async () => {
      const message = {
        to: 'user@example.com',
        subject: 'Test Notification',
        body: 'This is a test'
      }

      const result = await sendNotificationActivity(message, mockContext)

      expect(result).toBe(true)
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Sending notification to user@example.com')
      )
    })

    it('should handle different message formats', async () => {
      const message = {
        to: 'admin@company.com',
        subject: 'Alert',
        body: 'System alert message'
      }

      const result = await sendNotificationActivity(message, mockContext)
      expect(result).toBe(true)
    })

    it('should include delay in processing', async () => {
      const message = {
        to: 'test@test.com',
        subject: 'Test',
        body: 'Body'
      }

      const startTime = Date.now()
      await sendNotificationActivity(message, mockContext)
      const endTime = Date.now()

      expect(endTime - startTime).toBeGreaterThanOrEqual(100)
    })
  })
})
