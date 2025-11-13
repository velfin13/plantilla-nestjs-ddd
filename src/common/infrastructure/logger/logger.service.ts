import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;

  setContext(context: string): void {
    this.context = context;
  }

  log(message: string, context?: string): void {
    this.printMessage(LogLevel.INFO, message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.printMessage(LogLevel.ERROR, message, context);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string, context?: string): void {
    this.printMessage(LogLevel.WARN, message, context);
  }

  debug(message: string, context?: string): void {
    this.printMessage(LogLevel.DEBUG, message, context);
  }

  verbose(message: string, context?: string): void {
    this.printMessage(LogLevel.DEBUG, message, context);
  }

  private printMessage(level: LogLevel, message: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const ctx = context || this.context || 'Application';
    const color = this.getColorByLevel(level);
    
    console.log(
      `${color}[${timestamp}] [${level.toUpperCase()}] [${ctx}]\x1b[0m ${message}`,
    );
  }

  private getColorByLevel(level: LogLevel): string {
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
    };
    return colors[level] || '\x1b[0m';
  }
}
