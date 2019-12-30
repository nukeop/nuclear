import { app, nativeImage, BrowserWindow, Menu, Tray } from 'electron';
import { inject, injectable } from 'inversify';
import path from 'path';
import url from 'url';

import { Env } from '../../utils/env';
import Config from '../config';
import HttpApi from '../http';
import Logger, { mainLogger } from '../logger';
import Platform from '../platform';
import Store from '../store';

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

  constructor(
    @inject(Platform) private platform: Platform,
    @inject(Config) private config: Config,
    @inject(mainLogger) private logger: Logger,
    @inject(HttpApi) httpApi: HttpApi,
    @inject(Store) store: Store
  ) {
    const iconPath = config.isProd() ? 'resources' : '../resources/media';
    let icon = nativeImage.createFromPath(path.resolve(__dirname, iconPath, 'icon.png'));

    this.browserWindow = new BrowserWindow({

      title: config.title,
      width: 1366,
      height: 768,
      frame: !store.getOption('framelessWindow'),
      icon,
      show: false,
      webPreferences: {
        // required by electron-timber
        nodeIntegration: true,
        webSecurity: config.isProd(),
        additionalArguments: [store.getOption('disableGPU') && '--disable-gpu']
      }
    });

    if (platform.isMac()) {
      app.dock.setIcon(icon);
      icon = nativeImage.createFromPath(path.resolve(__dirname, iconPath, 'icon_apple.png'));
    }

    if (platform.isWindows()) {
      this.browserWindow.flashFrame(true);
      this.browserWindow.once('focus', () => this.browserWindow.flashFrame(false));
    }

    const trayMenu = Menu.buildFromTemplate([
      {
        label: 'Quit',
        type: 'normal',
        click: async () => {
          await httpApi.close();

          app.quit();
        }
      }
    ]);

    const tray = new Tray(icon);
    tray.setTitle(config.title);
    tray.setToolTip(config.title);
    tray.setContextMenu(trayMenu);

    this.browserWindow.once('ready-to-show', () => {
      this.browserWindow.show();

      config.isDev() && this.browserWindow.webContents.openDevTools();
    });
  }

  focus() {
    this.browserWindow.focus();
  }

  getBrowserWindow() {
    return this.browserWindow;
  }

  load() {
    this.browserWindow.loadURL(urlMapper[this.config.env]);
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
