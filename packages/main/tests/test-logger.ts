import { ILogger } from '../src/services/logger';
export class TestLogger implements ILogger {
  log(...args: any[]): void { 
    // eslint-disable-next-line no-console
    console.log(...args);
  }
  logEvent({ direction, event, data, once }): void { }
  warn(...args: any[]): void { 
    console.warn(...args);
  }
  error(...args: any[]): void {
    console.error(...args);
  }
}
