import { NuclearBrutMeta, IpcEvents } from '@nuclear/core';
import { IpcMessageEvent, DownloadItem } from 'electron';
import { inject } from 'inversify';
import _ from 'lodash';

import { ipcController, ipcEvent } from '../utils/decorators';
import Download from '../services/download';
import Logger, { $mainLogger } from '../services/logger';
import Window from '../services/window';

interface  DownloadRef{
  uuid: string;
  ref: DownloadItem;
}

@ipcController()
class DownloadIpcCtrl {
  private downloadItems: DownloadRef[]=[];
  constructor(
    @inject(Download) private download: Download,
    @inject($mainLogger) private logger: Logger,
    @inject(Window) private window: Window
  ) {}
  
  /**
   * Start a download using the download service
   */
  @ipcEvent(IpcEvents.DOWNLOAD_START)
  async onStartDownload(event: IpcMessageEvent, data: NuclearBrutMeta) {
    try {
      const {uuid} = data;
      const downloadRef = this.downloadItems.find((item => item.uuid===uuid));
      if (downloadRef){
        if (downloadRef.ref.canResume()){
          downloadRef.ref.resume();
          return;
        }
        this.downloadItems = this.downloadItems.filter((item => item.uuid===uuid));
      }
      const artistName = _.isString(_.get(data, 'artist'))
        ? _.get(data, 'artist')
        : _.get(data, 'artist.name');
  
      const query = `${artistName} ${_.get(data, 'name')}`;
      const filename = `${artistName} - ${_.get(data, 'name')}`;
  
      this.logger.log(`Start Download: ${artistName} - ${_.get(data, 'name')}`);
  
      await this.download.start({
        query,
        filename,
        onStart: (item) => {
          this.downloadItems = this.downloadItems.filter((item) => item.uuid!==uuid);
          this.downloadItems.push({uuid, ref: item});
        },
        onProgress: (progress) => {
          if (progress.transferredBytes===progress.totalBytes){
            this.window.send(IpcEvents.DOWNLOAD_FINISHED, uuid);
            this.downloadItems = this.downloadItems.filter((item) => item.uuid!==uuid);
          }
          this.window.send(IpcEvents.DOWNLOAD_PROGRESS, {
            uuid,
            progress: progress.percent
          });
        }
      });
      this.logger.log(`Download success: ${artistName} - ${_.get(data, 'name')}`);
    } catch (error) {
      this.window.send(IpcEvents.DOWNLOAD_ERROR, { uuid: data.uuid, error });
      throw error;
    }
  }
  
  @ipcEvent(IpcEvents.DOWNLOAD_PAUSE)
  async onPauseDownload(event: IpcMessageEvent, data: NuclearBrutMeta) {
    try {
      const {uuid} = data;
      const downloadRef = this.downloadItems.find((item => item.uuid===uuid));
      if (downloadRef){
        downloadRef.ref.pause();
      }
    } catch (error) {
      this.window.send(IpcEvents.DOWNLOAD_ERROR, { uuid: data.uuid, error });
      throw error;
    }
  }
  
}

export default DownloadIpcCtrl;
