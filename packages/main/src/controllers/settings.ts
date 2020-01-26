import { app, IpcMessageEvent } from 'electron';
import { inject } from 'inversify';

import Config from '../services/config';
import HttpApi from '../services/http';
import NuclearApi from '../interfaces/nuclear-api';
import Store from '../services/store';
import SystemApi from '../services/system-api';
import Window from '../services/window';
import { ipcEvent, ipcController } from '../utils/decorators';
import LocalLibrary from '../services/local-library';

@ipcController()
class SettingsIpcCtrl {
  constructor(
    @inject(Config) private config: Config,
    @inject(HttpApi) private httpApi: HttpApi,
    @inject(LocalLibrary) private localLibrary: LocalLibrary,
    @inject(SystemApi) private systemApi: NuclearApi,
    @inject(Store) private store: Store,
    @inject(Window) private window: Window
  ) {}

  @ipcEvent('started', { once: true })
  onStart() {
    this.store.getOption('api.enabled') && this.httpApi.listen();
    this.systemApi.listen();
  }

  @ipcEvent('close')
  async onClose() {
    await Promise.all([
      this.httpApi.close(),
      this.localLibrary.cleanUnusedLocalThumbnails()
    ]);
  
    app.quit();
  }

  @ipcEvent('minimize')
  onMinimize() {
    this.window.minimize();
  }

  @ipcEvent('maximize')
  onMaximize() {
    this.window.maximize();
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

  @ipcEvent('connectivity')
  toggleConnectivity(event: IpcMessageEvent, isConnected: boolean) {
    this.config.setConnectivity(isConnected);
  }
}

export default SettingsIpcCtrl;
