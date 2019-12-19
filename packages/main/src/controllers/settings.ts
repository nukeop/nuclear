import { app, IpcMessageEvent } from 'electron';
import { inject } from 'inversify';

import HttpApi from '../services/http';
import NuclearApi from '../interfaces/nuclear-api';
import Platform from '../services/platform';
import Store from '../services/store';
import SystemApi from '../services/system-api';
import Window from '../services/window';
import { ipcEvent, ipcController } from '../utils/decorators';
import ControlBar from '../services/control-bar';

@ipcController()
class SettingsIpcCtrl {
  constructor(
    @inject(ControlBar) private controlBar: ControlBar,
    @inject(HttpApi) private httpApi: HttpApi,
    @inject(SystemApi) private systemApi: NuclearApi,
    @inject(Platform) private platform: Platform,
    @inject(Store) private store: Store,
    @inject(Window) private window: Window
  ) {}

  @ipcEvent('started', { once: true })
  onStart(event: IpcMessageEvent) {
    this.httpApi.rendererWindow = event.sender;
    this.store.getOption('api.enabled') && this.httpApi.listen();

    this.controlBar.rendererWindow = event.sender;
    this.systemApi.rendererWindow = event.sender;
    this.systemApi.listen();
  }

  @ipcEvent('close')
  async onClose() {
    await this.httpApi.close();
    app.quit();
  }

  @ipcEvent('minimize')
  onMinimize() {
    this.window.minimize();
  }

  @ipcEvent('maximize')
  onMaximize() {
    if (this.platform.isMac()) {
      this.window.isFullScreen() ? this.window.setFullScreen(false) : this.window.setFullScreen(true);
    } else {
      this.window.isMaximized() ? this.window.unmaximize() : this.window.maximize();
    }
  }

  @ipcEvent('restart-api')
  async restartHttpApi() {
    await this.httpApi.close();

    this.httpApi.listen();
  }

  @ipcEvent('stop-api')
  closeHttpServer() {
    return this.httpApi.close();
  }
}

export default SettingsIpcCtrl;
