/* eslint-disable @typescript-eslint/no-explicit-any */
import timber from 'electron-timber';

timber.hookConsole();

/**
 * @see {@link https://github.com/sindresorhus/electron-timber}
 */

interface EventMessage {
  once?: boolean;
  direction: 'in' | 'out';
  event: any;
  data?: any;
}

class Logger {
  private logger: typeof timber;

  constructor(name?: string) {
    this.logger = name ? timber.create({ name }) : timber;
  }

  log(...args: any[]): void {
    this.logger.log(...args);
  }

  logEvent({ direction, event, data, once }: EventMessage) {
    const message = `${once ? 'once' : ''} ${direction === 'in' ? '==>' : '<=='} ${event}`;

    let dataMessage: string = typeof data;

    if (dataMessage === 'object') {
      if (Array.isArray(data)) {
        let arrayType;
        if (typeof data[0] === 'object') {
          arrayType = data[0].constructor.name;
        } else if (data[0]) {
          arrayType = typeof data[0];
        } else {
          arrayType = 'void';
        }
        dataMessage = `Array<${arrayType}>`;
      } else if (data) {
        dataMessage = data.constructor.name;
      }
    }

    this.log(message, data ? `: ${dataMessage}` : '');
  }
  
  warn(...args: any[]): void {
    this.logger.warn(...args);
  }

  error(...args: any[]): void {
    this.logger.error(...args);
  }
}

export const $mainLogger = Symbol('main-logger');
export const $ipcLogger = Symbol('ipc-logger');
export const $systemApiLogger = Symbol('system-api-logger');
export const $httpApiLogger = Symbol('http-api-logger');

export default Logger;
