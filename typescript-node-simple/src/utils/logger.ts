interface Logger {
  info: (message: string) => void
  error: (message: string) => void
}

export const logger: Logger = {
  info: (message: string): void => {
    console.log(`[INFO] ${message}`)
  },
  error: (message: string): void => {
    console.error(`[ERROR] ${message}`)
  }
}
