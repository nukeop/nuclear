/* eslint-disable no-console */
import { app, BrowserWindow, ipcMain, IpcMainEvent, ipcRenderer, IpcRendererEvent } from 'electron';
import { performance } from 'node:perf_hooks';
import process from 'node:process';

const isMain = process.type === 'browser';
const isRenderer = process.type === 'renderer';
const isDevelopment = process.env.NODE_ENV === 'development';

const logChannel = '__ELECTRON_NUCLEAR_LOGGER_LOG__';
const warnChannel = '__ELECTRON_NUCLEAR_LOGGER_WARN__';
const errorChannel = '__ELECTRON_NUCLEAR_LOGGER_ERROR__';
const updateChannel = '__ELECTRON_NUCLEAR_LOGGER_UPDATE__';
const defaultsNameSpace = '__ELECTRON_NUCLEAR_LOGGER_DEFAULTS__';

const logLevels = {
  info: 0,
  warn: 1,
  error: 2
};

type LogLevel = keyof typeof logLevels;
type LogArgs = unknown[];
type ConsoleMethod = (...args: LogArgs) => void;

interface NuclearLoggerOptions {
  name?: string;
  ignore?: RegExp;
  logLevel?: LogLevel;
}

interface NuclearLoggerDefaults {
  ignore: RegExp | null;
  shouldHookConsole: boolean;
  logLevel: LogLevel;
}

let remoteMain: typeof import('@electron/remote/main') | null = null;
if (isMain) {
  // Only import in main process
  remoteMain = require('@electron/remote/main');
}

let isConsoleHooked = false;
const _console: Partial<Console> = {};

const hookableMethods = ['log', 'warn', 'error', 'time', 'timeEnd'];

let longestNameLength = 0;

const terminalColors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  yellow: '\x1b[33m'
};

class NuclearLogger {
  #timers = new Map<string, number>();
  #initialOptions: NuclearLoggerOptions;
  #name: string;
  #prefixColor: string;

  constructor(options: NuclearLoggerOptions = {}) {
    this.#initialOptions = options;
    this.#name = options.name ?? '';
    this.#prefixColor = this.#generatePrefixColor();

    if (this.#name.length > longestNameLength) {
      longestNameLength = this.#name.length;
    }
  }

  get options(): NuclearLoggerOptions & NuclearLoggerDefaults {
    return {
      ...this.getDefaults(),
      ...this.#initialOptions
    };
  }

  get console(): Console {
    return isConsoleHooked ? (_console as Console) : console;
  }

  #generatePrefixColor(): string {
    const hue = Math.floor(parseInt(this.#name, 36) / 36 * 360);
    if (isRenderer) {
      return `hsl(${hue}, 50%, 50%)`;
    }
    // For main process, convert HSL to closest ANSI color
    return `\x1b[38;5;${Math.floor((hue / 360) * 230 + 20)}m`;
  }

  #getPrefix(): string {
    if (isRenderer) {
      return `%c${this.#name.padStart(longestNameLength)}%c ›`;
    }
    return `${this.#prefixColor}${this.#name.padStart(longestNameLength)}${terminalColors.reset} ›`;
  }

  log(...args: LogArgs): void {
    if (logLevels[this.options.logLevel] > logLevels.info) {
      return;
    }

    if (isRenderer) {
      ipcRenderer.send(logChannel, args);
    } else if (this.#name) {
      args.unshift(this.#getPrefix());
    }

    if (this.options.ignore && this.options.ignore.test(args.join(' '))) {
      return;
    }

    this.console.log(...args);
  }

  warn(...args: LogArgs): void {
    if (logLevels[this.options.logLevel] > logLevels.warn) {
      return;
    }

    if (isRenderer) {
      ipcRenderer.send(warnChannel, args);
    } else if (this.#name) {
      args.unshift(`${this.#getPrefix()} ${terminalColors.yellow}`);
      args.push(terminalColors.reset);
    }

    if (this.options.ignore && this.options.ignore.test(args.join(' '))) {
      return;
    }

    this.console.warn(...args);
  }

  error(...args: LogArgs): void {
    if (logLevels[this.options.logLevel] > logLevels.error) {
      return;
    }

    if (isRenderer) {
      ipcRenderer.send(errorChannel, args);
    } else if (this.#name) {
      args.unshift(`${this.#getPrefix()} ${terminalColors.red}`);
      args.push(terminalColors.reset);
    }

    if (this.options.ignore && this.options.ignore.test(args.join(' '))) {
      return;
    }

    this.console.error(...args);
  }

  time(label = 'default'): void {
    if (logLevels[this.options.logLevel] > logLevels.info) {
      return;
    }

    this.#timers.set(label, performance.now());
  }

  timeEnd(label = 'default'): void {
    if (this.#timers.has(label)) {
      const elapsed = performance.now() - this.#timers.get(label);
      const args = [`${label}: ${elapsed.toFixed(2)}ms`];
      this.#timers.delete(label);

      if (isRenderer) {
        ipcRenderer.send(logChannel, args);
      } else if (this.#name) {
        args.unshift(this.#getPrefix(), `color: ${this.#prefixColor}`, 'color: inherit');
      }

      if (this.options.ignore && this.options.ignore.test(args.join(' '))) {
        return;
      }

      this.console.log(...args);
    }
  }

  streamLog(stream: NodeJS.ReadableStream): void {
    if (logLevels[this.options.logLevel] > logLevels.info) {
      return;
    }

    stream.setEncoding('utf8');
    stream.on('data', (data: string) => {
      this.log(data.trim());
    });
  }

  streamWarn(stream: NodeJS.ReadableStream): void {
    if (logLevels[this.options.logLevel] > logLevels.warn) {
      return;
    }

    stream.setEncoding('utf8');
    stream.on('data', (data: string) => {
      this.warn(data.trim());
    });
  }

  streamError(stream: NodeJS.ReadableStream): void {
    if (logLevels[this.options.logLevel] > logLevels.error) {
      return;
    }

    stream.setEncoding('utf8');
    stream.on('data', (data: string) => {
      this.error(data.trim());
    });
  }

  create(options: NuclearLoggerOptions = {}): NuclearLogger {
    return new NuclearLogger(options);
  }

  getDefaults(): NuclearLoggerDefaults {
    if (isMain) {
      return { ...global[defaultsNameSpace] };
    }
    
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const remote = require('@electron/remote');
    return { ...remote.getGlobal(defaultsNameSpace) };
  }

  hookConsole(options: { main?: boolean; renderer?: boolean } = { main: isMain, renderer: isRenderer }): () => void {
    if (options.main && isRenderer) {
      throw new Error('You cannot hook the console in the main process from a renderer process.');
    }

    const hookThisConsole = (isMain && options.main) || (isRenderer && options.renderer);
    const shouldHookRenderers = isMain && options.renderer;

    if (hookThisConsole) {
      if (isConsoleHooked) {
        return this.unhookConsole(hookThisConsole, shouldHookRenderers);
      }

      isConsoleHooked = true;

      for (const key of hookableMethods) {
        _console[key] = console[key as keyof Console];
        console[key] = (this[key as keyof NuclearLogger] as Function).bind(this);
      }
    }

    if (shouldHookRenderers) {
      this.hookRenderers(true);
    }

    return this.unhookConsole(hookThisConsole, shouldHookRenderers);
  }

  private unhookConsole(hookThisConsole: boolean, shouldHookRenderers: boolean): () => void {
    return () => {
      if (isConsoleHooked) {
        if (hookThisConsole) {
          isConsoleHooked = false;
          for (const key of hookableMethods) {
            console[key] = _console[key] as ConsoleMethod;
            _console[key] = undefined;
          }
        }

        if (shouldHookRenderers) {
          this.hookRenderers(false);
        }
      }
    };
  }

  private hookRenderers(flag: boolean): void {
    if (isMain) {
      global[defaultsNameSpace].shouldHookConsole = flag;
      for (const win of BrowserWindow.getAllWindows()) {
        win.webContents.send(updateChannel, flag);
      }
    }
  }
}

const logger = new NuclearLogger({
  name: isMain ? 'main' : undefined
});

if (isMain) {
  const rendererLogger = new NuclearLogger({ name: 'renderer' });

  if (ipcMain.listenerCount(logChannel) === 0) {
    ipcMain.on(logChannel, (event: IpcMainEvent, data: LogArgs) => {
      // Forward to all renderer windows except sender
      BrowserWindow.getAllWindows()
        .filter(win => win.webContents.id !== event.sender.id)
        .forEach(win => {
          win.webContents.send(logChannel, data);
        });
      rendererLogger.log(...data);
    });
  }

  if (ipcMain.listenerCount(warnChannel) === 0) {
    ipcMain.on(warnChannel, (event: IpcMainEvent, data: LogArgs) => {
      BrowserWindow.getAllWindows()
        .filter(win => win.webContents.id !== event.sender.id)
        .forEach(win => {
          win.webContents.send(warnChannel, data);
        });
      rendererLogger.warn(...data);
    });
  }

  if (ipcMain.listenerCount(errorChannel) === 0) {
    ipcMain.on(errorChannel, (event: IpcMainEvent, data: LogArgs) => {
      BrowserWindow.getAllWindows()
        .filter(win => win.webContents.id !== event.sender.id)
        .forEach(win => {
          win.webContents.send(errorChannel, data);
        });
      rendererLogger.error(...data);
    });
  }
} else if (isRenderer) {
  // Add flag to prevent re-logging messages that originated from this renderer
  let isLoggingInProgress = false;

  ipcRenderer.on(logChannel, (_event: IpcRendererEvent, data: LogArgs) => {
    if (!isLoggingInProgress) {
      logger.log(...data);
    }
  });

  ipcRenderer.on(warnChannel, (_event: IpcRendererEvent, data: LogArgs) => {
    if (!isLoggingInProgress) {
      logger.warn(...data);
    }
  });

  ipcRenderer.on(errorChannel, (_event: IpcRendererEvent, data: LogArgs) => {
    if (!isLoggingInProgress) {
      logger.error(...data);
    }
  });

  const originalLog = logger.log.bind(logger);
  const originalWarn = logger.warn.bind(logger);
  const originalError = logger.error.bind(logger);

  logger.log = (...args: LogArgs) => {
    isLoggingInProgress = true;
    originalLog(...args);
    isLoggingInProgress = false;
  };

  logger.warn = (...args: LogArgs) => {
    isLoggingInProgress = true;
    originalWarn(...args);
    isLoggingInProgress = false;
  };

  logger.error = (...args: LogArgs) => {
    isLoggingInProgress = true;
    originalError(...args);
    isLoggingInProgress = false;
  };

  ipcRenderer.on(updateChannel, (_event: IpcRendererEvent, flag: boolean) => {
    if (flag) {
      logger.hookConsole();
    } else {
      isConsoleHooked = false;
      for (const key of hookableMethods) {
        console[key] = _console[key] as ConsoleMethod;
        _console[key] = undefined;
      }
    }
  });
}

export default logger;
