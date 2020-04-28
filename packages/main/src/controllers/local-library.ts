import { inject } from 'inversify';
import { IpcMessageEvent } from 'electron';

import LocalLibrary from '../services/local-library';
import { ipcController, ipcEvent } from '../utils/decorators';
import LocalLibraryDb from '../services/local-library/db';
import Platform from '../services/platform';
import Window from '../services/window';

@ipcController()
class LocalIpcCtrl {
  constructor(
    @inject(LocalLibrary) private localLibrary: LocalLibrary,
    @inject(LocalLibraryDb) private localLibraryDb: LocalLibraryDb,
    @inject(Platform) private platform: Platform,
    @inject(Window) private window: Window
  ) {}

  private normalizeFolderPath(folder: string) {
    if (this.platform.isWindows()) {
      folder = folder.replace(/\\/g, '/');
    }

    return folder;
  }

  /**
   * get local files metas
   */
  @ipcEvent('get-metas')
  getLocalMetas(event: IpcMessageEvent) {
    event.returnValue = this.localLibraryDb.getCache();
  }

  /**
   * get local library folders from store
   */
  @ipcEvent('get-localfolders')
  getLocalFolders(event: IpcMessageEvent) {
    event.returnValue = this.localLibraryDb.get('localFolders');
  }

  /**
   * store local library folders
   */
  @ipcEvent('set-localfolders')
  async setLocalFolders(event: IpcMessageEvent, localFolders: string[]) {
    localFolders
      .map(folder => this.normalizeFolderPath(folder))
      .forEach(folder => {
        this.localLibraryDb.addLocalFolder(folder);
      });

    const cache = await this.localLibrary.scanFoldersAndGetMeta((scanProgress, scanTotal) => {
      this.window.send('local-files-progress', {scanProgress, scanTotal});
    });

    this.window.send('local-files', cache);
  }

  /**
   * Remove a local folder and all metadata attached to it 
   */
  @ipcEvent('remove-localfolder')
  async removeLocalFolder(event: IpcMessageEvent, localFolder: string) {
    const metas = await this.localLibrary.removeLocalFolder(
      this.normalizeFolderPath(localFolder)
    );

    this.window.send('local-files', metas);
  }

  /**
   * scan local library for audio files, format and store all the metadata
   */
  @ipcEvent('refresh-localfolders')
  async onRefreshLocalFolders() {
    try {
      const cache = await this.localLibrary.scanFoldersAndGetMeta((scanProgress, scanTotal) => {
        this.window.send('local-files-progress', {scanProgress, scanTotal});
      });

      this.window.send('local-files', cache);
    } catch (err) {
      this.window.send('local-files-error', err);
    }
  }

  @ipcEvent('queue-drop')
  async addTracks(event: IpcMessageEvent, filesPath: string[]) {
    const metas = await this.localLibrary.getMetas(filesPath);

    this.window.send('queue-add', metas);
  }

  /**
   * get expanded library folders from store
   */
  /* @ipcEvent('get-expandedfolders')
  getExpandedFolders(event: IpcMessageEvent) {
    event.returnValue = this.localLibraryDb.get('expandedFolders');
  }

  /**
   * store expanded library folders
   *#/
  @ipcEvent('set-expandedfolders')
  async setExpandedFolders(event: IpcMessageEvent, expandedFolders: string[]) {
    this.localLibraryDb.setExpandedFolders(expandedFolders);
  } */
}

export default LocalIpcCtrl;
