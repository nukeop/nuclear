import { inject } from 'inversify';
import { IpcMessageEvent } from 'electron';
import { IpcEvents } from '@nuclear/core';
import {scanFolders} from '@nuclear/scanner';

import LocalLibrary from '../services/local-library';
import { ipcController, ipcEvent } from '../utils/decorators';
import LocalLibraryDb from '../services/local-library/db';
import Platform from '../services/platform';
import Window from '../services/window';
import Config from '../services/config';
import Logger, { $mainLogger } from '../services/logger';
import { scannerTrackToNuclearMeta } from '@nuclear/core/src/helpers/scanner';

@ipcController()
class LocalIpcCtrl {
  constructor(
    @inject(Config) private config: Config,
    @inject(LocalLibrary) private localLibrary: LocalLibrary,
    @inject(LocalLibraryDb) private localLibraryDb: LocalLibraryDb,
    @inject(Platform) private platform: Platform,
    @inject($mainLogger) private logger: Logger,
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
  async getLocalMetas(event: IpcMessageEvent) {
    const tracks = await this.localLibraryDb.getTracks();
    event.returnValue = tracks as unknown as boolean;
  }

  /**
   * get local library folders from store
   */
  @ipcEvent(IpcEvents.LOCALFOLDERS_GET)
  async getLocalFolders(event: IpcMessageEvent) {
    const folders = await this.localLibraryDb.getLocalFolders();
    event.returnValue = folders.map(({ path }) => path) as unknown as boolean;
  }

  /**
   * store local library folders
   */
  @ipcEvent(IpcEvents.LOCALFOLDERS_SET)
  async setLocalFolders(event: IpcMessageEvent, directories: string[]) {
    await Promise.all(
      directories
        .map(folder => this.localLibraryDb.addFolder(this.normalizeFolderPath(folder)))
    );

    const cache = await scanFolders(directories, this.config.supportedFormats, this.localLibrary.getThumbnailsDir(), (scanProgress, scanTotal) => {
      this.window.send(IpcEvents.LOCAL_FILES_PROGRESS, {scanProgress, scanTotal});
    }, () => {});

    this.window.send(IpcEvents.LOCAL_FILES, Object.values(cache).reduce((acc, track) => ({
      ...acc,
      [track.uuid as string]: track
    }), {}));
  }

  /**
   * Remove a local folder and all metadata attached to it 
   */
  @ipcEvent(IpcEvents.LOCALFOLDER_REMOVE)
  async removeLocalFolder(event: IpcMessageEvent, localFolder: string) {
    const metas = await this.localLibraryDb.removeLocalFolder(
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
      const folders = await this.localLibraryDb.getLocalFolders();

      const cache = await scanFolders(
        folders.map(folder => folder.path), 
        this.config.supportedFormats, 
        this.localLibrary.getThumbnailsDir(), 
        (scanProgress, scanTotal) => {
          this.window.send(IpcEvents.LOCAL_FILES_PROGRESS, {scanProgress, scanTotal});
        }, () => {});

      this.localLibraryDb.updateTracks(cache.map(scannerTrackToNuclearMeta));

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
}

export default LocalIpcCtrl;
