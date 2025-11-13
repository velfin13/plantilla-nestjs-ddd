import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogMetadata {
  [key: string]: any;
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private context?: string;
  private readonly isProduction = process.env.NODE_ENV === 'production';

  setContext(context: string): void {
    this.context = context;
  }

  log(message: string, metadata?: LogMetadata): void {
    this.printMessage(LogLevel.INFO, message, this.context, metadata);
  }

  error(message: string, trace?: string, context?: string, metadata?: LogMetadata): void {
    this.printMessage(LogLevel.ERROR, message, context || this.context, metadata);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string, context?: string, metadata?: LogMetadata): void {
    this.printMessage(LogLevel.WARN, message, context || this.context, metadata);
  }

  debug(message: string, context?: string, metadata?: LogMetadata): void {
    if (!this.isProduction) {
      this.printMessage(LogLevel.DEBUG, message, context || this.context, metadata);
    }
  }

  verbose(message: string, context?: string, metadata?: LogMetadata): void {
    if (!this.isProduction) {
      this.printMessage(LogLevel.DEBUG, message, context || this.context, metadata);
    }
  }

  private printMessage(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: LogMetadata,
  ): void {
    const timestamp = new Date().toISOString();
    const ctx = context || 'Application';
    const color = this.getColorByLevel(level);
    const levelUpper = level.toUpperCase().padEnd(5);

    if (this.isProduction) {
      console.log(
        JSON.stringify({
          timestamp,
          level: level.toUpperCase(),
          context: ctx,
          message,
          ...(metadata && { metadata }),
        }),
      );
    } else {
      const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
      console.log(
        `${color}[${timestamp}] [${levelUpper}] [${ctx}]\x1b[0m ${message}${metaStr}`,
      );
    }
  }

  private getColorByLevel(level: LogLevel): string {
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m',
      [LogLevel.INFO]: '\x1b[32m',
      [LogLevel.WARN]: '\x1b[33m',
      [LogLevel.ERROR]: '\x1b[31m',
    };
    return colors[level] || '\x1b[0m';
  }
}
