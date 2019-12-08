import { app, nativeImage, BrowserWindow, Menu, Tray } from 'electron';
import path from 'path';

/**
 * Wrapper around electron BrowserWindow
 * @see {@link https://electronjs.org/docs/api/browser-window}
 */
class Window extends BrowserWindow {
  /**
   * @param {{
  *   httpApi: import('./http').default,
  *   platform: import('./platform'),
  *   store: import('./store').default
  * }} param0 
   */
  constructor({ httpApi, platform, store }) {
    let icon = nativeImage.createFromPath(path.resolve(__dirname, 'resources', 'media', 'icon.png'));
    super({
      title: 'Nuclear Music Player',
      width: 1366,
      height: 768,
      frame: !store.getOption('framelessWindow'),
      icon,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        experimentalFeatures: false,
        webSecurity: false,
        allowRunningInsecureContent: false
      },
      additionalArguments: [
        store.getOption('disableGPU') && '--disable-gpu'
      ]
    });

    if (platform.isMac()) {
      app.dock.setIcon(icon);
      icon = nativeImage.createFromPath(path.resolve(__dirname, 'resources', 'media', 'icon_apple.png'));
    }
  
    const trayMenu = Menu.buildFromTemplate([
      {
        label: 'Quit',
        type: 'normal',
        click: async () => {
          await httpApi.closeHttpServer();
  
          app.quit();
        }
      }
    ]);
  
    const tray = new Tray(icon);
    tray.setTitle('Nuclear Music Player');
    tray.setToolTip('Nuclear Music Player');
    tray.setContextMenu(trayMenu);
  }
}

export default Window;
