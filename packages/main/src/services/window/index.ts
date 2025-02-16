import { app, nativeImage, BrowserWindow } from 'electron';
import installExtension, {REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer';
import { inject, injectable } from 'inversify';
import path from 'path';
import url from 'url';

import { Env } from '../../utils/env';
import Config from '../config';
import Logger, { $mainLogger, $ipcLogger } from '../logger';
import Platform from '../platform';
import Store from '../store';
import { IpcEvents } from '@nuclear/core';

const urlMapper: Record<Env, string> = {
  [Env.DEV]: url.format({
    pathname: 'localhost:8080',
    protocol: 'http:',
    slashes: true
  }),
  [Env.PROD]: url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }),
  [Env.TEST]: ''
};

/**
 * Wrapper around electron BrowserWindow
 * @see {@link https://electronjs.org/docs/api/browser-window}
 */
@injectable()
class Window {
  private browserWindow: BrowserWindow;
  private isReady: Promise<void>;
  private resolve: () => void;
  private defaultWidth: number;
  private defaultHeight: number;

  constructor(
    @inject(Config) private config: Config,
    @inject($mainLogger) private logger: Logger,
    @inject($ipcLogger) private ipcLogger: Logger,
    @inject(Platform) private platform: Platform,
    @inject(Store) store: Store
  ) {
    const icon = nativeImage.createFromPath(config.icon);

    this.defaultWidth = config.defaultWidth;
    this.defaultHeight = config.defaultHeight;

    this.browserWindow = new BrowserWindow({
      title: config.title,
      width: this.defaultWidth,
      height: this.defaultHeight,
      minWidth: 330,
      minHeight: 450,
      
      frame: !store.getOption('framelessWindow'),
      icon,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        contextIsolation: false,
        additionalArguments: [
          store.getOption('disableGPU') && '--disable-gpu'
        ]
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@electron/remote/main').enable(this.browserWindow.webContents);

    if (platform.isMac()) {
      app.dock.setIcon(icon);
    }

    if (platform.isWindows()) {
      this.browserWindow.flashFrame(true);
      this.browserWindow.once('focus', () => this.browserWindow.flashFrame(false));
    }

    this.browserWindow.on('app-command', (e, cmd) => {
      if (cmd === 'browser-backward') {
        this.browserWindow.webContents.send(IpcEvents.NAVIGATE_BACK);
        
      }
      if (cmd === 'browser-forward') {
        this.browserWindow.webContents.send(IpcEvents.NAVIGATE_FORWARD);
      }
    });

    this.isReady = new Promise((resolve) => {
      this.resolve = resolve;
    });

    this.browserWindow.once('ready-to-show', () => {
      this.browserWindow.show();

      if (config.isDev()) {
        this.browserWindow.webContents.openDevTools();
      }

      this.resolve();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(event: string, ...param: any[]): void {
    this.ipcLogger.logEvent({ direction: 'out', event, data: param[0] });

    this.browserWindow.webContents.send(event, ...param);
  }

  focus() {
    this.browserWindow.focus();
  }

  getBrowserWindow() {
    return this.browserWindow;
  }

  load() {
    this.browserWindow.loadURL(urlMapper[this.config.env]);
    return this.isReady;
  }

  minimize() {
    this.browserWindow.minimize();
  }

  maximize() {
    if (this.platform.isMac()) {
      this.browserWindow.isFullScreen() ? this.browserWindow.setFullScreen(false) : this.browserWindow.setFullScreen(true);
    } else {
      this.browserWindow.isMaximized() ? this.browserWindow.unmaximize() : this.browserWindow.maximize();
    }
  }

  minify() {
    // Unmaximize the window if it's maximized
    if (this.platform.isMac()) {
      this.browserWindow.isFullScreen() && this.browserWindow.setFullScreen(false);
    } else {
      this.browserWindow.isMaximized() && this.browserWindow.unmaximize();
    }

    this.browserWindow.setSize(0, 0, true);
  }

  restoreDefaultSize() {
    this.browserWindow.setSize(this.defaultWidth, this.defaultHeight, true);
  }

  restore() {
    if (this.browserWindow.isMinimized()) {
      this.browserWindow.restore();
    }
  }

  setTitle(title: string) {
    this.browserWindow.setTitle(title);
  }

  openDevTools() {
    if (this.browserWindow.webContents.isDevToolsOpened()) {
      this.browserWindow.webContents.closeDevTools();
    } else {
      this.browserWindow.webContents.openDevTools();
    }
  }

  async installDevTools() {
    try {
      await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS]);
      this.logger.log('Developer tools successfully installed: React & Redux DevTools');
    } catch (err) {
      this.logger.warn('Failed to install developer tools', { error: err });
    }
  }

  close() {
    this.browserWindow.close();
  }
}

export default Window;
