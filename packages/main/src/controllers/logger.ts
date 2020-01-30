/* eslint-disable @typescript-eslint/no-explicit-any */
import { IpcMessageEvent } from 'electron';
import { inject } from 'inversify';

import { ipcEvent, ipcController } from '../utils/decorators';
import Logger, { $mainLogger } from '../services/logger';

const ELECTRON_TIMBER_ERROR_EVENT = '__ELECTRON_TIMBER_ERROR__';

@ipcController()
class LoggerIpcCtrl {
  constructor(
    @inject($mainLogger) private logger: Logger
  ) {}

  @ipcEvent(ELECTRON_TIMBER_ERROR_EVENT)
  logRendererError(event: IpcMessageEvent, ...args: any[]) {
    this.logger.writeToFile('renderer', ...args);
  }
}

export default LoggerIpcCtrl;
