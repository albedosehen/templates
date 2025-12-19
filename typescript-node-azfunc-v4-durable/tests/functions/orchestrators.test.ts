import { OrchestrationContext } from 'durable-functions'
import {
  helloOrchestrator,
  fanOutFanInOrchestrator,
  approvalOrchestrator
} from '../../src/functions/orchestrators'

describe('Orchestrators', () => {
  describe('helloOrchestrator', () => {
    it('should call sayHello activity three times with different cities', () => {
      const mockContext = {
        df: {
          getInput: jest.fn().mockReturnValue('World'),
          callActivity: jest
            .fn()
            .mockReturnValueOnce('Hello World - Tokyo!')
            .mockReturnValueOnce('Hello World - Seattle!')
            .mockReturnValueOnce('Hello World - London!')
        }
      } as unknown as OrchestrationContext

      const gen = helloOrchestrator(mockContext)

      // First yield
      gen.next()
      expect(mockContext.df.callActivity).toHaveBeenCalledWith('sayHello', 'World - Tokyo')

      // Second yield
      gen.next('Hello World - Tokyo!')
      expect(mockContext.df.callActivity).toHaveBeenCalledWith('sayHello', 'World - Seattle')

      // Third yield
      gen.next('Hello World - Seattle!')
      expect(mockContext.df.callActivity).toHaveBeenCalledWith('sayHello', 'World - London')

      // Final result
      const result = gen.next('Hello World - London!')
      expect(result.value).toEqual([
        'Hello World - Tokyo!',
        'Hello World - Seattle!',
        'Hello World - London!'
      ])
      expect(result.done).toBe(true)
    })

    it('should use default input when none provided', () => {
      const mockContext = {
        df: {
          getInput: jest.fn().mockReturnValue(undefined),
          callActivity: jest.fn()
        }
      } as unknown as OrchestrationContext

      const gen = helloOrchestrator(mockContext)
      gen.next()

      expect(mockContext.df.callActivity).toHaveBeenCalledWith('sayHello', 'World - Tokyo')
    })
  })

  describe('fanOutFanInOrchestrator', () => {
    it('should process all items in parallel', () => {
      const workBatch = ['Item1', 'Item2', 'Item3']
      const mockTasks = workBatch.map((item) => Promise.resolve(`Processed: ${item}`))

      const mockContext = {
        df: {
          callActivity: jest.fn(),
          Task: {
            all: jest.fn().mockReturnValue(mockTasks)
          }
        }
      } as unknown as OrchestrationContext

      const gen = fanOutFanInOrchestrator(mockContext)

      // First yield - get work batch
      gen.next()
      expect(mockContext.df.callActivity).toHaveBeenCalledWith('getWorkBatch')

      // Second yield - process parallel tasks
      gen.next(workBatch)

      // Verify parallel tasks were created
      expect(mockContext.df.Task.all).toHaveBeenCalled()

      // Final result
      const result = gen.next(['Processed: Item1', 'Processed: Item2', 'Processed: Item3'])
      expect(result.value).toEqual({
        processedCount: 3,
        results: ['Processed: Item1', 'Processed: Item2', 'Processed: Item3']
      })
      expect(result.done).toBe(true)
    })
  })

  describe('approvalOrchestrator', () => {
    it('should handle approval event', () => {
      const input = { request: 'Purchase Order #123' }
      const mockApprovalEvent = Promise.resolve(true)
      const mockTimeoutTask = Promise.resolve('timeout')

      const mockContext = {
        df: {
          getInput: jest.fn().mockReturnValue(input),
          waitForExternalEvent: jest.fn().mockReturnValue(mockApprovalEvent),
          createTimer: jest.fn().mockReturnValue(mockTimeoutTask),
          currentUtcDateTime: new Date(),
          callActivity: jest.fn(),
          Task: {
            any: jest.fn().mockReturnValue(mockApprovalEvent)
          }
        }
      } as unknown as OrchestrationContext

      const gen = approvalOrchestrator(mockContext)

      // Setup event and timeout
      gen.next()

      // Winner is approval event
      gen.next(mockApprovalEvent)

      // Approval is true
      gen.next(true)

      // Process approval
      gen.next()
      expect(mockContext.df.callActivity).toHaveBeenCalledWith('processApproval', input)
    })

    it('should handle timeout', () => {
      const input = { request: 'Purchase Order #123' }
      const mockApprovalEvent = Promise.resolve(true)
      const mockTimeoutTask = Promise.resolve('timeout')

      const mockContext = {
        df: {
          getInput: jest.fn().mockReturnValue(input),
          waitForExternalEvent: jest.fn().mockReturnValue(mockApprovalEvent),
          createTimer: jest.fn().mockReturnValue(mockTimeoutTask),
          currentUtcDateTime: new Date(),
          callActivity: jest.fn(),
          Task: {
            any: jest.fn().mockReturnValue(mockTimeoutTask)
          }
        }
      } as unknown as OrchestrationContext

      const gen = approvalOrchestrator(mockContext)

      // Setup event and timeout
      gen.next()

      // Winner is timeout
      const result = gen.next(mockTimeoutTask)

      expect(result.value).toEqual({
        status: 'timeout',
        input: input
      })
    })
  })
})
