import { isDev } from './env'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

// Proper type definition for log metadata
interface LogMetadata {
  [key: string]: string | number | boolean | undefined | null | Record<string, unknown>
}

// Extended metadata that allows error objects
interface ErrorMetadata extends LogMetadata {
  error?: {
    message: string
    stack?: string
    name: string
  } | string
}

class Logger {
  private isDev: boolean

  constructor() {
    this.isDev = isDev
  }

  private formatMessage(level: LogLevel, message: string, metadata?: LogMetadata | ErrorMetadata): string {
    const timestamp = new Date().toISOString()
    const prefix = this.getPrefix(level)
    
    if (this.isDev) {
      // Pretty format for development
      const meta = metadata ? `\n${JSON.stringify(metadata, null, 2)}` : ''
      return `${prefix} ${message}${meta}`
    } else {
      // JSON format for production (easier to parse by log aggregators)
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...metadata,
      })
    }
  }

  private getPrefix(level: LogLevel): string {
    const prefixes = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    }
    return prefixes[level] || 'ℹ️'
  }

  debug(message: string, metadata?: LogMetadata): void {
    if (this.isDev) {
      console.debug(this.formatMessage('debug', message, metadata))
    }
  }

  info(message: string, metadata?: LogMetadata): void {
    console.info(this.formatMessage('info', message, metadata))
  }

  warn(message: string, metadata?: LogMetadata): void {
    console.warn(this.formatMessage('warn', message, metadata))
  }

  error(message: string, error?: Error | unknown, metadata?: LogMetadata): void {
    const errorData: ErrorMetadata = error instanceof Error
      ? {
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          ...metadata,
        }
      : { error: String(error), ...metadata } as ErrorMetadata

    console.error(this.formatMessage('error', message, errorData))
  }

  // Specialized logging methods
  apiRequest(method: string, path: string, metadata?: LogMetadata): void {
    this.info(`API ${method} ${path}`, metadata)
  }

  apiResponse(method: string, path: string, status: number, duration?: number): void {
    const level = status >= 400 ? 'warn' : 'info'
    const message = `API ${method} ${path} → ${status}`
    
    if (level === 'warn') {
      this.warn(message, { duration })
    } else {
      this.info(message, { duration })
    }
  }

  dbQuery(operation: string, collection: string, duration?: number): void {
    this.debug(`DB ${operation} ${collection}`, { duration })
  }

  // User action tracking
  userAction(action: string, userId?: string, metadata?: LogMetadata): void {
    this.info(`User action: ${action}`, { userId, ...metadata })
  }
}

// Export singleton
export const logger = new Logger()

// Utility to measure duration
export function withTiming<T>(fn: () => T, logFn: (duration: number) => void): T {
  const start = Date.now()
  try {
    const result = fn()
    const duration = Date.now() - start
    logFn(duration)
    return result
  } catch (error) {
    const duration = Date.now() - start
    logFn(duration)
    throw error
  }
}

export async function withTimingAsync<T>(
  fn: () => Promise<T>,
  logFn: (duration: number) => void
): Promise<T> {
  const start = Date.now()
  try {
    const result = await fn()
    const duration = Date.now() - start
    logFn(duration)
    return result
  } catch (error) {
    const duration = Date.now() - start
    logFn(duration)
    throw error
  }
}
