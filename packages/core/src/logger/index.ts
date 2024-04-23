/* eslint-disable node/no-unsupported-features/node-builtins */
import { ipcRenderer, ipcMain } from 'electron';
import winston, { format } from 'winston';
import { performance } from 'perf_hooks';
import * as crypto from 'crypto';

const logChannel = '__NUCLEAR_LOG__';
const warnChannel = '__NUCLEAR_WARN__';
const errorChannel = '__NUCLEAR_ERROR__';
const updateChannel = '__NUCLEAR_UPDATE__';
const defaultsNameSpace = '__NUCLEAR_DEFAULTS__';

type Loggable = string | Error | object;

enum LogLevel { INFO, WARN, ERROR }

interface LoggerOptions {
    name?: string;
    ignore?: RegExp;
    logLevel?: LogLevel;
}

const logLevels = {
  info: 0,
  warn: 1,
  error: 2
};

const isRendererProcess = process && process.type === 'renderer';

const colorCodes = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m'
} as const;

const colorArray = [
  'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white',
  'brightRed', 'brightGreen', 'brightYellow', 'brightBlue', 'brightMagenta', 'brightCyan', 'brightWhite'
] as const;
  
function colorize(text: string, color: keyof typeof colorCodes): string {
  return `${colorCodes[color]}${text}${colorCodes.reset}`;
}


class NuclearLogger {
    private isEnabled: boolean;
    private name: string;
    private prefixColor: string;
    private timers: Map<string, number>;
    private logLevel: LogLevel;
    private logger: winston.Logger;
    private static longestNameLength = 0;


    constructor(options: LoggerOptions = {}) {
      this.isEnabled = true; // Should implement filtering based on the environment or provided options
      this.name = options.name || '';
      this.prefixColor = this.getColorFromName(this.name);
      this.timers = new Map<string, number>();
      this.logLevel = options.logLevel || logLevels.info;
      this.logger = winston.createLogger({
        levels: winston.config.npm.levels,
        format: format.combine(
          format.colorize(),
          format.printf(({ level, message }) => `${this.getPrefix()} ${level}: ${message}`)
        ),
        transports: [new winston.transports.Console()]
      });

      if (!isRendererProcess && options.name) {
        this.setupIpcListeners();
      }
    }

    private setupIpcListeners() {
      ipcMain.on(logChannel, (_, message) => this.log(message));
      ipcMain.on(warnChannel, (_, message) => this.warn(message));
      ipcMain.on(errorChannel, (_, message) => this.error(message));
    }
    
    private getColorFromName(name: string): keyof typeof colorCodes {
      const hash = crypto.createHash('md5').update(name).digest('hex');
      const hashValue = parseInt(hash.substring(0, 2), 16); // Get an integer value from the first two hex digits
      return colorArray[hashValue % colorArray.length];
    }

    private getPrefix(): string {
      const paddedName = this.name.padEnd(NuclearLogger.longestNameLength, ' ');
      return `${colorCodes[this.prefixColor]}${paddedName}${colorCodes.reset} >`;
    }

    log(...args: Loggable[]) {
      if (!this.isEnabled || this.logLevel > logLevels.info) {
        return;
      }
      this.sendOrLog(logChannel, args);
    }

    warn(...args: Loggable[]) {
      if (!this.isEnabled || this.logLevel > logLevels.warn) {
        return;
      }
      this.sendOrLog(warnChannel, args);
    }

    error(...args: Loggable[]) {
      if (!this.isEnabled || this.logLevel > logLevels.error) {
        return;
      }
      this.sendOrLog(errorChannel, args);
    }

    private sendOrLog(channel: string, args: Loggable[]) {
      if (isRendererProcess) {
        ipcRenderer.send(channel, args);
      } else {
        const message = args.join(' ');
        switch (channel) {
        case logChannel:
          this.logger.info(message);
          break;
        case warnChannel:
          this.logger.warn(message);
          break;
        case errorChannel:
          this.logger.error(message);
          break;
        }
      }
    }

    time(label = 'default') {
      if (!this.isEnabled || this.logLevel > logLevels.info) {
        return;
      }
      this.timers.set(label, performance.now());
    }

    timeEnd(label = 'default') {
      const start = this.timers.get(label);
      if (start) {
        const duration = performance.now() - start;
        this.log(`${label}: ${duration}ms`);
        this.timers.delete(label);
      }
    }
}

export const nuclearLogger = new NuclearLogger({ name: isRendererProcess ? 'renderer' : 'main' });
