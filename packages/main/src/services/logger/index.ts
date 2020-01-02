/* eslint-disable @typescript-eslint/no-explicit-any */
import timber from 'electron-timber';

timber.hookConsole();

/**
 * @see {@link https://github.com/sindresorhus/electron-timber}
 */

class Logger {
  private logger: typeof timber;

  constructor(name?: string) {
    this.logger = name ? timber.create({ name }) : timber;
  }

  log(...args: any[]): void {
    this.logger.log(...args);
  }
  
  warn(...args: any[]): void {
    this.logger.warn(...args);
  }

  error(...args: any[]): void {
    this.logger.error(...args);
  }
}

export const mainLogger = Symbol('main-logger');
export const ipcLogger = Symbol('ipc-logger');
export const systemApiLogger = Symbol('system-api-logger');
export const httpApiLogger = Symbol('http-api-logger');

export default Logger;
