/* eslint-disable no-console */
import { app, BrowserWindow, ipcMain, IpcMainEvent, IpcRendererEvent, session, Session, WebContents } from 'electron';
import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import process from 'node:process';

const isMain = process.type === 'browser';
const isRenderer = process.type === 'renderer';
const isDevelopment = process.env.NODE_ENV === 'development';

const logChannel = '__ELECTRON_NUCLEAR_LOGGER_LOG__';
const warnChannel = '__ELECTRON_NUCLEAR_LOGGER_WARN__';
const errorChannel = '__ELECTRON_NUCLEAR_LOGGER_ERROR__';
const updateChannel = '__ELECTRON_NUCLEAR_LOGGER_UPDATE__';
const defaultsNameSpace = '__ELECTRON_NUCLEAR_LOGGER_DEFAULTS__';

const preloadScript = resolve(__dirname, 'preload.js');

const logLevels = {
  info: 0,
  warn: 1,
  error: 2
};

type LogLevel = keyof typeof logLevels;

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

if (isMain) {
  (global as any)[defaultsNameSpace] = {
    ignore: null,
    shouldHookConsole: false,
    logLevel: isDevelopment ? logLevels.info : logLevels.warn
  };
}

let isConsoleHooked = false;
const _console: Partial<Console> = {};

const hookableMethods = ['log', 'warn', 'error', 'time', 'timeEnd'];

let longestNameLength = 0;

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
    return `hsl(${hue}, 50%, 50%)`;
  }

  #getPrefix(): string {
    return `%c${this.#name.padStart(longestNameLength)}%c ›`;
  }

  log(...args: any[]): void {
    if (logLevels[this.options.logLevel] > logLevels.info) {
      return;
    }

    if (isRenderer) {
      (window as any).electronApi.send(logChannel, args);
    } else if (this.#name) {
      args.unshift(this.#getPrefix(), `color: ${this.#prefixColor}`, 'color: inherit');
    }

    if (this.options.ignore && this.options.ignore.test(args.join(' '))) {
      return;
    }

    this.console.log(...args);
  }

  warn(...args: any[]): void {
    if (logLevels[this.options.logLevel] > logLevels.warn) {
      return;
    }

    if (isRenderer) {
      (window as any).electronApi.send(warnChannel, args);
    } else if (this.#name) {
      args.unshift(this.#getPrefix(), `color: ${this.#prefixColor}`, 'color: yellow');
    }

    if (this.options.ignore && this.options.ignore.test(args.join(' '))) {
      return;
    }

    this.console.warn(...args);
  }

  error(...args: any[]): void {
    if (logLevels[this.options.logLevel] > logLevels.error) {
      return;
    }

    if (isRenderer) {
      (window as any).electronApi.send(errorChannel, args);
    } else if (this.#name) {
      args.unshift(this.#getPrefix(), `color: ${this.#prefixColor}`, 'color: red');
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
        (window as any).electronApi.send(logChannel, args);
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
    const defaults = isMain
      ? (global as any)[defaultsNameSpace]
      : (window as any).electronApi.getGlobal(defaultsNameSpace);
    return { ...defaults };
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
        (_console as any)[key] = console[key as keyof Console];
        (console as any)[key] = (this[key as keyof NuclearLogger] as Function).bind(this);
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
            (console as any)[key] = (_console as any)[key];
            (_console as any)[key] = null;
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
      (global as any)[defaultsNameSpace].shouldHookConsole = flag;
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
    ipcMain.on(logChannel, (_event: IpcMainEvent, data: any[]) => {
      rendererLogger.log(...data);
    });
  }

  if (ipcMain.listenerCount(warnChannel) === 0) {
    ipcMain.on(warnChannel, (_event: IpcMainEvent, data: any[]) => {
      rendererLogger.warn(...data);
    });
  }

  if (ipcMain.listenerCount(errorChannel) === 0) {
    ipcMain.on(errorChannel, (_event: IpcMainEvent, data: any[]) => {
      rendererLogger.error(...data);
    });
  }

  (async () => {
    await (app as any).whenReady();

    const mySession: Session = session.defaultSession;
    const currentPreloads = mySession.getPreloads();
    if (!currentPreloads.includes(preloadScript)) {
      mySession.setPreloads([...currentPreloads, preloadScript]);
    }
  })();
} else if (isRenderer) {
  (window as any).electronApi.onReceive(updateChannel, (_event: IpcRendererEvent, flag: boolean) => {
    if (flag) {
      logger.hookConsole();
    } else {
      isConsoleHooked = false;
      for (const key of hookableMethods) {
        (console as any)[key] = (_console as any)[key];
        (_console as any)[key] = null;
      }
    }
  });
}

export default logger;
