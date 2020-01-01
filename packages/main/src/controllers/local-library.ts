import { inject } from 'inversify';
import { IpcMessageEvent } from 'electron';
import _ from 'lodash';
import path from 'path';

import LocalLibrary from '../services/local-library';
import { ipcController, ipcEvent } from '../utils/decorators';
import LocalLibraryDb, { LocalSearchQuery } from '../services/local-library/db';

@ipcController()
class LocalIpcCtrl {
  constructor(
    @inject(LocalLibrary) private localLibrary: LocalLibrary,
    @inject(LocalLibraryDb) private localLibraryDb: LocalLibraryDb
  ) {}

  /**
   * get local libray folder from store
   */
  @ipcEvent('get-localfolders')
  getLocalFolders(event: IpcMessageEvent) {
    event.returnValue = this.localLibraryDb.get('localFolders');
  }

  /**
   * store local library folders
   */
  @ipcEvent('set-localfolders')
  setLocalFolders(event: IpcMessageEvent, localFolders: string[]) {
    this.localLibraryDb.set('localFolders', localFolders);
  }

  /**
   * scan local library for audio files, format and store all the metadata
   */
  @ipcEvent('refresh-localfolders')
  async onRefreshLocalFolders(event: IpcMessageEvent) {
    try {
      const cache = await this.localLibrary.scanFoldersAndGetMeta((scanProgress, scanTotal) => {
        event.sender.send('local-files-progress', {scanProgress, scanTotal});
      });

      event.sender.send('local-files', cache);
    } catch (err) {
      event.sender.send('local-files-error', err);
    }
  }

  @ipcEvent('local-search')
  async search(event: IpcMessageEvent, query: LocalSearchQuery) {
    event.returnValue = this.localLibraryDb.search(query);
  }

  @ipcEvent('queue-drop')
  async addTrack(event: IpcMessageEvent, filesPath: string[]) {
    const metas = await Promise.all(
      filesPath.map(filePath => this.localLibrary.getSingleMeta(filePath))
    );

    _.uniq(
      filesPath.map(filePath => path.dirname(filePath))
    ).forEach(folder => {
      this.localLibraryDb.addLocalFolder(folder)
    });

    await this.localLibrary.scanFoldersAndGetMeta();

    event.sender.send('queue-add', metas);
  }
}

export default LocalIpcCtrl;
