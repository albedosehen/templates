import { ActivityHandler } from 'durable-functions'

/**
 * Simple activity that returns a greeting
 */
export const sayHelloActivity: ActivityHandler = (name: string): string => {
  return `Hello ${name}!`
}

/**
 * Activity that simulates getting a batch of work items
 * In production, this might query a database or API
 */
export const getWorkBatchActivity: ActivityHandler = (): string[] => {
  // Simulate getting a batch of work items
  return ['Item1', 'Item2', 'Item3', 'Item4', 'Item5']
}

/**
 * Activity that processes a single work item
 * Simulates async processing with a delay
 */
export const processItemActivity: ActivityHandler = async (item: string): Promise<string> => {
  // Simulate async processing
  await new Promise((resolve) => setTimeout(resolve, 100))
  return `Processed: ${item}`
}

/**
 * Activity that processes an approval request
 */
export const processApprovalActivity: ActivityHandler = async (input: unknown): Promise<string> => {
  // In production, this might update a database, send notifications, etc.
  await new Promise((resolve) => setTimeout(resolve, 50))
  return `Approval processed for: ${JSON.stringify(input)}`
}

/**
 * Activity that checks the status of a job
 * In production, this would query an external service or database
 */
export const checkJobStatusActivity: ActivityHandler = async (): Promise<string> => {
  // Simulate random status for demonstration
  const statuses = ['pending', 'processing', 'completed']
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return randomStatus
}

/**
 * Activity that performs data validation
 */
export const validateDataActivity: ActivityHandler = async (data: unknown): Promise<boolean> => {
  // Simulate validation logic
  await new Promise((resolve) => setTimeout(resolve, 50))

  if (!data) {
    return false
  }

  return true
}

/**
 * Activity that sends a notification
 */
export const sendNotificationActivity: ActivityHandler = async (message: {
  to: string
  subject: string
  body: string
}): Promise<boolean> => {
  // In production, this would integrate with email/SMS services
  console.log(`Sending notification to ${message.to}: ${message.subject}`)
  await new Promise((resolve) => setTimeout(resolve, 100))
  return true
}
