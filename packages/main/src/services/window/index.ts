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
class Window extends BrowserWindow {
  private config: Config;
  private logger: Logger;

  constructor(
    @inject(Config) config: Config,
    @inject(HttpApi) httpApi: HttpApi,
    @inject(Platform) platform: Platform,
    @inject(Store) store: Store,
    @inject(mainLogger) logger: Logger
  ) {
    const iconPath = config.isProd() ? 'resources' : '../resources/media';
    let icon = nativeImage.createFromPath(path.resolve(__dirname, iconPath, 'icon.png'));

    super({
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

    this.config = config;
    this.logger = logger;

    if (platform.isMac()) {
      app.dock.setIcon(icon);
      icon = nativeImage.createFromPath(path.resolve(__dirname, iconPath, 'icon_apple.png'));
    }

    if (platform.isWindows()) {
      this.flashFrame(true);
      this.once('focus', () => this.flashFrame(false));
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
  }

  load() {
    this.loadURL(urlMapper[this.config.env]);
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
