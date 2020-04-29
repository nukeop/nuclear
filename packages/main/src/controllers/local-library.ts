import { inject } from 'inversify';
import { IpcMessageEvent } from 'electron';

import LocalLibrary from '../services/local-library';
import { ipcController, ipcEvent } from '../utils/decorators';
import LocalLibraryDb from '../services/local-library/db';
import Platform from '../services/platform';
import Window from '../services/window';
import { IpcEvents } from '@nuclear/core';

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
  @ipcEvent(IpcEvents.LOCAL_METAS)
  getLocalMetas(event: IpcMessageEvent) {
    event.returnValue = this.localLibraryDb.getCache();
  }

  /**
   * get local library folders from store
   */
  @ipcEvent(IpcEvents.LOCALFOLDERS_GET)
  getLocalFolders(event: IpcMessageEvent) {
    event.returnValue = this.localLibraryDb.get('localFolders');
  }

  /**
   * store local library folders
   */
  @ipcEvent(IpcEvents.LOCALFOLDERS_SET)
  async setLocalFolders(event: IpcMessageEvent, localFolders: string[]) {
    localFolders
      .map(folder => this.normalizeFolderPath(folder))
      .forEach(folder => {
        this.localLibraryDb.addLocalFolder(folder);
      });

    const cache = await this.localLibrary.scanFoldersAndGetMeta((scanProgress, scanTotal) => {
      this.window.send(IpcEvents.LOCAL_FILES_PROGRESS, {scanProgress, scanTotal});
    });

    this.window.send(IpcEvents.LOCAL_FILES, cache);
  }

  /**
   * Remove a local folder and all metadata attached to it 
   */
  @ipcEvent(IpcEvents.LOCALFOLDER_REMOVE)
  async removeLocalFolder(event: IpcMessageEvent, localFolder: string) {
    const metas = await this.localLibrary.removeLocalFolder(
      this.normalizeFolderPath(localFolder)
    );

    this.window.send(IpcEvents.LOCAL_FILES, metas);
  }

  /**
   * scan local library for audio files, format and store all the metadata
   */
  @ipcEvent(IpcEvents.LOCALFOLDERS_REFRESH)
  async onRefreshLocalFolders() {
    try {
      const cache = await this.localLibrary.scanFoldersAndGetMeta((scanProgress, scanTotal) => {
        this.window.send(IpcEvents.LOCAL_FILES_PROGRESS, {scanProgress, scanTotal});
      });

      this.window.send(IpcEvents.LOCAL_FILES, cache);
    } catch (err) {
      this.window.send(IpcEvents.LOCAL_FILES_ERROR, err);
    }
  }

  @ipcEvent(IpcEvents.QUEUE_DROP)
  async addTracks(event: IpcMessageEvent, filesPath: string[]) {
    const metas = await this.localLibrary.getMetas(filesPath);

    this.window.send(IpcEvents.PLAYLIST_ADD_QUEUE, metas);
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
