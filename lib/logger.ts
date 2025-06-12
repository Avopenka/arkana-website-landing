export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  ip?: string;
  userAgent?: string;
}
class Logger {
  private level: LogLevel = LogLevel.INFO;
  constructor() {
    this.level = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO;
  }
  private formatEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } as any : undefined
    };
  }
  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }
  private log(entry: LogEntry) {
    if (!this.shouldLog(entry.level)) return;
    const levelStr = LogLevel[entry.level];
    const contextStr = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : '';
    const errorStr = entry.error ? ` | Error: ${entry.error.message}` : '';
    
    // In development, use console for immediate feedback
    if (process.env.NODE_ENV === 'development') {
      const message = `[${entry.timestamp}] ${levelStr}: ${entry.message}${contextStr}${errorStr}`;
      
      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(message);
          break;
        case LogLevel.INFO:
          console.info(message);
          break;
        case LogLevel.WARN:
          console.warn(message);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(message);
          if (entry.error?.stack) console.error(entry.error.stack);
          break;
      }
    } else {
      // In production, send to external logging service
      this.sendToExternalService(entry);
    }
  }
  private async sendToExternalService(entry: LogEntry) {
    // TODO: Implement external logging service (e.g., Sentry, LogRocket)
    // For now, just store critical errors
    if (entry.level >= LogLevel.ERROR) {
      try {
        // Could send to webhook, database, or external service
      } catch (err) {
      }
    }
  }
  debug(message: string, context?: Record<string, any>) {
    this.log(this.formatEntry(LogLevel.DEBUG, message, context));
  }
  info(message: string, context?: Record<string, any>) {
    this.log(this.formatEntry(LogLevel.INFO, message, context));
  }
  warn(message: string, context?: Record<string, any>) {
    this.log(this.formatEntry(LogLevel.WARN, message, context));
  }
  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log(this.formatEntry(LogLevel.ERROR, message, context, error));
  }
  fatal(message: string, error?: Error, context?: Record<string, any>) {
    this.log(this.formatEntry(LogLevel.FATAL, message, context, error));
  }
}
export const logger = new Logger();

// Convenience function for component-specific logging
export function createComponentLogger(componentName: string) {
  return {
    debug: (message: string, context?: Record<string, any>) => 
      logger.debug(`[${componentName}] ${message}`, context),
    info: (message: string, context?: Record<string, any>) => 
      logger.info(`[${componentName}] ${message}`, context),
    warn: (message: string, context?: Record<string, any>) => 
      logger.warn(`[${componentName}] ${message}`, context),
    error: (message: string, error?: Error, context?: Record<string, any>) => 
      logger.error(`[${componentName}] ${message}`, error, context),
    fatal: (message: string, error?: Error, context?: Record<string, any>) => 
      logger.fatal(`[${componentName}] ${message}`, error, context),
  };
}