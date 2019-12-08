import { ipcListener } from '../helpers/decorators';

class LocalIpcCtrl {
  constructor({ localLibrary }) {
    /** @type {import('../services/localLibrary').default} */
    this.localLibrary = localLibrary;
  }
  
  /**
   * scan local library for audio files, format and store all the metadata
   * @param {import('electron').IpcMessageEvent} event 
   */
  @ipcListener('refresh-localfolders')
  async onRefreshLocalFolders(event) {
    try {      
      const cache = await this.localLibrary.scanFoldersAndGetMeta((scanProgress, scanTotal) => {
        event.sender.send('local-files-progress', {scanProgress, scanTotal});
      });
  
      event.sender.send('local-files', cache);
    } catch (err) {
      event.sender.send('local-files-error', err);
    }
  }
  
}

export default LocalIpcCtrl;
