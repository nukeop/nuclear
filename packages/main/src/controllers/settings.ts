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
import { IpcEvents } from '@nuclear/core';

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

  @ipcEvent(IpcEvents.STARTED, { once: true })
  onStart() {
    this.store.getOption('api.enabled') && this.httpApi.listen();
    this.systemApi.listen();
  }

  @ipcEvent(IpcEvents.WINDOW_CLOSE)
  async onClose() {
    await Promise.all([
      this.httpApi.close(),
      this.localLibrary.cleanUnusedLocalThumbnails()
    ]);
  
    app.quit();
  }

  @ipcEvent(IpcEvents.WINDOW_MINIMIZE)
  onMinimize() {
    this.window.minimize();
  }

  @ipcEvent(IpcEvents.WINDOW_MAXIMIZE)
  onMaximize() {
    this.window.maximize();
  }

  @ipcEvent(IpcEvents.WINDOW_OPEN_DEVTOOLS)
  openDevtools() {
    this.window.openDevTools();
  }

  @ipcEvent(IpcEvents.API_RESTART)
  async restartHttpApi() {
    await this.httpApi.close();

    this.httpApi.listen();
  }

  @ipcEvent(IpcEvents.API_STOP)
  closeHttpServer() {
    return this.httpApi.close();
  }

  @ipcEvent(IpcEvents.CONNECTIVITY)
  toggleConnectivity(event: IpcMessageEvent, isConnected: boolean) {
    this.config.setConnectivity(isConnected);
  }
}

export default SettingsIpcCtrl;
