interface Logger {
  info: (message: string) => void
  error: (message: string) => void
  warn: (message: string) => void
  debug: (message: string) => void
}

export const logger: Logger = {
  info: (message: string): void => {
    console.log(`[INFO] ${message}`)
  },
  error: (message: string): void => {
    console.error(`[ERROR] ${message}`)
  },
  warn: (message: string): void => {
    console.warn(`[WARN] ${message}`)
  },
  debug: (message: string): void => {
    console.debug(`[DEBUG] ${message}`)
  }
}
