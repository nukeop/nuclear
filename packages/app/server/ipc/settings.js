import { app } from 'electron';
import { ipcListener } from '../helpers/decorators';

class SettingsIpcCtrl {
  constructor({ httpApi, mpris, platform, window, store }) {
    /** @type {import('../services/http').default} */
    this.httpApi = httpApi;
    /** @type {import('../services/platform')} */
    this.platform = platform;
    /** @type {import('../services/window').default} */
    this.window = window;
    /** @type {import('../services/mpris').default} */
    this.mpris = mpris;
    /** @type {import('../services/store').default} */
    this.store = store;
  }

  @ipcListener('started', { once: true })
  onStart(event) {
    this.httpApi.rendererWindow = event.sender;
    this.store.getOption('api.enabled') && this.httpApi.listen();

    if (this.platform.isLinux()) {
      this.mpris.rendererWindow = event.sender;
      this.mpris.listen();
    }
  }

  @ipcListener('close')
  async onClose() {
    await this.httpApi.close();
    app.quit();
  }

  @ipcListener('minimize')
  onMinimize() {
    this.window.minimize();
  }

  @ipcListener('maximize')
  onMaximize() {
    if (this.platform.isMac()) {
      this.window.isFullScreen() ? this.window.setFullScreen(false) : this.window.setFullScreen(true);
    } else {
      this.window.isMaximized() ? this.window.unmaximize() : this.window.maximize();
    }
  }

  @ipcListener('restart-api')
  async restartHttpApi() {
    await this.httpApi.close();

    this.httpApi.start();
  }

  @ipcListener('stop-api')
  closeHttpServer() {
    return this.httpApi.close();
  }
}

export default SettingsIpcCtrl;
