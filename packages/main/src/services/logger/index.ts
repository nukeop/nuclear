/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from 'electron';
import {logger} from '@nuclear/core';
import path from 'path';
import * as rts from 'rotating-file-stream';

logger.hookConsole();

const errorLogStream = rts.createStream(
  path.join(app.getPath('userData'), 'logs', 'nuclear-error.log'),
  {
    size: '5M',
    compress: 'gzip',
    rotate: 5
  }
);

interface EventMessage {
  once?: boolean;
  direction: 'in' | 'out';
  event: any;
  data?: any;
}
export interface ILogger {
  log(...args: any[]): void;
  logEvent({ direction, event, data, once }: EventMessage): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}

class Logger implements ILogger {
  private logger: typeof logger;
  private name: string;

  constructor(name?: string) {
    this.name = name || 'main';
    this.logger = name ? logger.create({ name }) : logger;
  }

  private getDate() {
    const now = new Date();
    let month = (now.getMonth() + 1).toString();

    if (month.length === 1) {
      month = `0${month}`;
    }
    
    return `[${now.getDate()}/${month}/${now.getFullYear()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`;
  }

  writeToFile(name: string, ...args: any[]) {
    args.forEach((log) => {
      if (log.stack) {
        errorLogStream.write(`${this.getDate()}${name} > ${log.stack}`);
      } else if (log.message) {
        errorLogStream.write(`${this.getDate()}${name} > ${log.message}\n`);
      } else if (log.toString) {
        errorLogStream.write(`${this.getDate()}${name} > ${log.toString()}\n`);
      }
    });
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

    this.log(message + (data ? `: ${dataMessage}` : ''));
  }
  
  warn(...args: any[]): void {
    this.logger.warn(...args);
  }

  error(...args: any[]): void {
    this.logger.error(...args);
    this.writeToFile(this.name, ...args);
  }
}

export const $mainLogger = Symbol('main-logger');
export const $ipcLogger = Symbol('ipc-logger');
export const $systemApiLogger = Symbol('system-api-logger');
export const $httpApiLogger = Symbol('http-api-logger');

export default Logger;
