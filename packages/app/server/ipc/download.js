import { ipcListener } from '../helpers/decorators';

class DownloadIpcCtrl {
  constructor({ download, logger }) {
    /** @type {import('../services/download').default} */
    this.download = download;
    /** @type {import('../services/logger').Logger} */
    this.logger = logger;
  }
  
  /**
   * Start a download using the download service
   * @param {import('electron').IpcMessageEvent} event 
   * @param {any} data 
   */
  @ipcListener('start-download')
  async onStartDownload(event, data) {
    try {
      const artistName = _.isString(_.get(data, 'artist'))
        ? _.get(data, 'artist')
        : _.get(data, 'artist.name');
  
      const query = `${artistName} ${_.get(data, 'name')}`;
      const filename = `${artistName} - ${_.get(data, 'name')}`;
  
      this.logger.log(`Start Download: ${artistName} - ${_.get(data, 'name')}`);
  
      const data = await this.download.start({
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
      this.logger && this.logger.log(`Download success: ${artistName} - ${_.get(data, 'name')}`);
      event.sender.send('download-finished', data.uuid);
    } catch (error) {
      event.sender.send('download-error', { uuid: data.uuid, error });
      throw error;
    }
  }
  
}

export default DownloadIpcCtrl;
