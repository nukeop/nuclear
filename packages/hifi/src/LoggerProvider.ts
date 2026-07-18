import { HifiLogger } from './types';

export class LoggerProvider {
  private static logger: HifiLogger;

  static init(logger: HifiLogger): void {
    LoggerProvider.logger = logger;
  }

  static get(): HifiLogger {
    return LoggerProvider.logger;
  }
}
