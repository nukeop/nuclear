import { app, nativeImage, BrowserWindow, Menu, Tray } from 'electron';
import { inject, injectable } from 'inversify';
import path from 'path';
import url from 'url';

import Config from '../config';
import HttpApi from '../http';
import Platform from '../platform';
import Store from '../store';
import { Env } from '../../utils/env';

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

  constructor(
    @inject(Config) config: Config,
    @inject(HttpApi) httpApi: HttpApi,
    @inject(Platform) platform: Platform,
    @inject(Store) store: Store
  ) {
    const iconPath = config.isProd() ? 'resources' : '../app/resources';
    let icon = nativeImage.createFromPath(path.resolve(__dirname, iconPath, 'media', 'icon.png'));

    super({
      title: config.title,
      width: 1366,
      height: 768,
      frame: !store.getOption('framelessWindow'),
      icon,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        experimentalFeatures: false,
        webSecurity: false,
        allowRunningInsecureContent: false,
        additionalArguments: [store.getOption('disableGPU') && '--disable-gpu']
      }
    });

    this.config = config;

    if (platform.isMac()) {
      app.dock.setIcon(icon);
      icon = nativeImage.createFromPath(path.resolve(__dirname, iconPath, 'media', 'icon_apple.png'));
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
}

export default Window;
