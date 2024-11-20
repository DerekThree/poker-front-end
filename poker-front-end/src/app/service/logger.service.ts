import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logLevel: LogLevel = LogLevel.DEBUG; 

  constructor() { }

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.logLevel >= level;
  }

  debug(message: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(message, ...optionalParams);
    }
  }

  info(message: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(message, ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(message, ...optionalParams);
    }
  }

  error(message: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(message, ...optionalParams);
    }
  }

}

export enum LogLevel {
  OFF = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4
}
