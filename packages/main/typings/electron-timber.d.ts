/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'electron-timber' {
  interface Logger {
    create(conf: {name: string, logLevel?: string}): Logger;
    log(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    hookConsole(): void;
  }
  const logger: Logger;
  export default logger;
}
