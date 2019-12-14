import { app, nativeImage, BrowserWindow, Menu, Tray } from 'electron';
import { inject, injectable } from 'inversify';
import path from 'path';

import Config from '../config';
import HttpApi from '../http';
import Platform from '../platform';
import Store from '../store';

/**
 * Wrapper around electron BrowserWindow
 * @see {@link https://electronjs.org/docs/api/browser-window}
 */
@injectable()
class Window extends BrowserWindow {
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

    if (platform.isMac()) {
      app.dock.setIcon(icon);
      icon = nativeImage.createFromPath(path.resolve(__dirname, iconPath, 'media', 'icon_apple.png'));
    }

    const trayMenu = Menu.buildFromTemplate([
      {
        label: 'Quit',
        type: 'normal',
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
}

export default Window;
