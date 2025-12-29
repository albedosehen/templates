interface Logger {
  info: (message: string, metadata?: unknown) => void
  error: (message: string, metadata?: unknown) => void
  warn: (message: string, metadata?: unknown) => void
  debug: (message: string, metadata?: unknown) => void
}

export const logger: Logger = {
  info: (message: string, metadata?: unknown): void => {
    const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : ''
    console.log(`[INFO] ${message}${metaStr}`)
  },
  error: (message: string, metadata?: unknown): void => {
    const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : ''
    console.error(`[ERROR] ${message}${metaStr}`)
  },
  warn: (message: string, metadata?: unknown): void => {
    const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : ''
    console.warn(`[WARN] ${message}${metaStr}`)
  },
  debug: (message: string, metadata?: unknown): void => {
    const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : ''
    console.debug(`[DEBUG] ${message}${metaStr}`)
  }
}
