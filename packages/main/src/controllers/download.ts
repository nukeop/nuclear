import {NuclearBrutMeta } from '@nuclear/common';
import { IpcMessageEvent } from 'electron';
import { inject } from 'inversify';
import _ from 'lodash';

import { ipcController, ipcEvent } from '../utils/decorators';
import Download from '../services/download';
import Logger, { mainLogger } from '../services/logger';

@ipcController()
class DownloadIpcCtrl {
  constructor(
    @inject(Download) private download: Download,
    @inject(mainLogger) private logger: Logger
  ) {}
  
  /**
   * Start a download using the download service
   */
  @ipcEvent('start-download')
  async onStartDownload(event: IpcMessageEvent, data: NuclearBrutMeta) {
    try {
      const artistName = _.isString(_.get(data, 'artist'))
        ? _.get(data, 'artist')
        : _.get(data, 'artist.name');
  
      const query = `${artistName} ${_.get(data, 'name')}`;
      const filename = `${artistName} - ${_.get(data, 'name')}`;
  
      this.logger.log(`Start Download: ${artistName} - ${_.get(data, 'name')}`);
  
      await this.download.start({
        query,
        filename,
        onStart: () => {
          event.sender.send('download-started', data.uuid);
        },
        onProgress: (progress) => {
          event.sender.send('download-progress', {
            uuid: data.uuid,
            progress
          });
        }
      });
      this.logger.log(`Download success: ${artistName} - ${_.get(data, 'name')}`);
      event.sender.send('download-finished', data.uuid);
    } catch (error) {
      event.sender.send('download-error', { uuid: data.uuid, error });
      throw error;
    }
  }
  
}

export default DownloadIpcCtrl;
