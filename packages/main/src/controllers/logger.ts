/* eslint-disable @typescript-eslint/no-explicit-any */
import { IpcMessageEvent } from 'electron';
import { inject } from 'inversify';

import { ipcEvent, ipcController } from '../utils/decorators';
import Logger, { $mainLogger } from '../services/logger';
import { IpcEvents } from '@nuclear/core';

@ipcController()
class LoggerIpcCtrl {
  constructor(
    @inject($mainLogger) private logger: Logger
  ) {}

  @ipcEvent(IpcEvents.ELECTRON_NUCLEAR_LOGGER_ERROR_EVENT)
  logRendererError(event: IpcMessageEvent, ...args: any[]) {
    this.logger.writeToFile('renderer', ...args);
  }
}

export default LoggerIpcCtrl;
