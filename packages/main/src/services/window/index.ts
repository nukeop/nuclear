import { app, nativeImage, BrowserWindow, Menu, Tray } from 'electron';
import { inject, injectable } from 'inversify';
import path from 'path';
import url from 'url';
import _ from 'lodash';

import { Env } from '../../utils/env';
import Config from '../config';
import Logger, { mainLogger } from '../logger';
import Platform from '../platform';
import Store from '../store';
import LocalLibrary from '../local-library';

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

  constructor(
    @inject(Config) private config: Config,
    @inject(LocalLibrary) private localLibrary: LocalLibrary,
    @inject(mainLogger) private logger: Logger,
    @inject(Platform) private platform: Platform,
    @inject(Store) store: Store
  ) {
    const icon = nativeImage.createFromPath(config.icon);

    this.browserWindow = new BrowserWindow({
      title: config.title,
      width: 1366,
      height: 768,
      frame: !store.getOption('framelessWindow'),
      icon,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: config.isProd(),
        additionalArguments: [
          store.getOption('disableGPU') && '--disable-gpu'
        ]
      }
    });

    if (platform.isMac()) {
      app.dock.setIcon(icon);
    }

    if (platform.isWindows()) {
      this.browserWindow.flashFrame(true);
      this.browserWindow.once('focus', () => this.browserWindow.flashFrame(false));
    }

    this.isReady = new Promise((resolve) => {
      this.resolve = resolve;
    })

    this.browserWindow.once('ready-to-show', () => {
      this.browserWindow.show();

      if (config.isDev()) {
        this.browserWindow.webContents.openDevTools();
      }

      this.resolve();
    });
  }

  send(event: string, param?: any): void {
    this.browserWindow.webContents.send(event, param);
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

  setTitle(title: string) {
    this.browserWindow.setTitle(title);
  }

  async installDevTools() {
    try {
      const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, default: installExtension } = await import('electron-devtools-installer');

      await Promise.all([
        installExtension(REACT_DEVELOPER_TOOLS),
        installExtension(REDUX_DEVTOOLS)
      ]);
      this.logger.log('devtools installed');
    } catch (err) {
      this.logger.warn('something fails while trying to install devtools');
    }
  }
}

export default Window;
