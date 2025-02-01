import { NuclearMeta, IpcEvents } from '@nuclear/core';

import { IpcMessageEvent, DownloadItem, app } from 'electron';
import { inject } from 'inversify';
import prism from 'prism-media';
import { createWriteStream, createReadStream } from 'fs';
import { rm } from 'fs/promises';

import { ipcController, ipcEvent, ipcInvokeHandler } from '../utils/decorators';
import { getTrackArtist, getTrackTitle } from '../utils/tracks';
import Download from '../services/download';
import Logger, { $mainLogger } from '../services/logger';
import Window from '../services/window';
import Platform from '../services/platform';
import path from 'path';

interface DownloadRef {
  uuid: string;
  ref: DownloadItem;
}

@ipcController()
class DownloadIpcCtrl {
  private downloadItems: DownloadRef[] = [];
  constructor(
    @inject(Download) private download: Download,
    @inject($mainLogger) private logger: Logger,
    @inject(Window) private window: Window,
    @inject(Platform) private platform: Platform
  ) { 
    const ffmpegFilename = platform.isWindows() ? 'ffmpeg.exe' : 'ffmpeg';

    process.env.FFMPEG_BIN = path.join(path.dirname(app.getAppPath()), '../resources/bin/', ffmpegFilename);
  }

  removeInvalidCharacters(filename: string): string {
    let invalidChars: string[];

    if (this.platform.isMac()) {
      invalidChars = [':', '/'];
    } else if (this.platform.isLinux()) {
      invalidChars = ['/'];
    } else { // Windows and other platforms
      invalidChars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*'];
    }

    const sanitizedFilename = filename.split('').filter((char) => !invalidChars.includes(char)).join('');
    return sanitizedFilename;
  }

  /**
   * Start a download using the download service
   */
  @ipcEvent(IpcEvents.DOWNLOAD_START)
  async onStartDownload(event: IpcMessageEvent, data: NuclearMeta) {
    try {
      const { uuid } = data;
      const downloadRef = this.downloadItems.find((item => item.uuid === uuid));
      if (downloadRef) {
        if (downloadRef.ref.canResume()) {
          downloadRef.ref.resume();
          this.window?.send(IpcEvents.DOWNLOAD_STARTED, uuid);
          return;
        }
        this.downloadItems = this.downloadItems.filter((item => item.uuid === uuid));
      }
      const artistName = getTrackArtist(data);
      const title = getTrackTitle(data);

      // .replace(/[/\\?%*:|"<>]/g, '-') or equivalent invalid characters based on platform
      const filename = this.removeInvalidCharacters(`${artistName} - ${title}`);

      await this.download.start({
        query: {
          artist: artistName,
          track: title
        },
        filename,
        onStarted: (item) => {
          this.downloadItems = this.downloadItems.filter((item) => item.uuid !== uuid);
          this.downloadItems.push({ uuid, ref: item });
          this.logger.log(`Download started: ${filename}`);
          this.window?.send(IpcEvents.DOWNLOAD_STARTED, uuid);
        },
        onProgress: (progress) => {
          this.window.send(IpcEvents.DOWNLOAD_PROGRESS, {
            uuid,
            progress: progress.percent
          });
        },
        onCompleted: (file) => {
          
          this.window?.send(IpcEvents.DOWNLOAD_FINISHED, uuid);
          this.logger.log(`Download success: ${artistName} - ${title}, path: ${file.path}`);
          this.downloadItems = this.downloadItems.filter((item) => item.uuid !== uuid);

          const inputStream = createReadStream(file.path);
          const outputFilename = file.path.replace(/\.[^.]+$/, '.mp3');
          const transcoder = new prism.FFmpeg({args: [
            '-f', 'mp3',
            '-vn',
            '-q:a', '2',
            '-ac', '2',
            '-ar', '48000',
            '-y'
          ]});

          transcoder
            .on('error', (error) => {
              this.logger.error(`Conversion error: ${error}`);
            })
            .on('end', async () => {
              this.logger.log(`Conversion success: ${outputFilename}`);
              await rm(file.path);
              this.logger.log(`Removed after conversion: ${file.path}`);
            });

          inputStream.pipe(transcoder).pipe(createWriteStream(outputFilename));
        }
      });
    } catch (error) {
      this.window.send(IpcEvents.DOWNLOAD_ERROR, { uuid: data.uuid, error });
      throw error;
    }
  }

  @ipcEvent(IpcEvents.DOWNLOAD_REMOVED)
  async onDownloadRemoved(event: IpcMessageEvent, data: NuclearMeta) {
    try {
      const { uuid } = data;
      this.downloadItems = this.downloadItems.filter((item => item.uuid === uuid));
    } catch (error) {
      this.window.send(IpcEvents.DOWNLOAD_ERROR, { uuid: data.uuid, error });
      throw error;
    }
  }

  @ipcEvent(IpcEvents.DOWNLOAD_PAUSE)
  async onPauseDownload(event: IpcMessageEvent, data: NuclearMeta) {
    try {
      const { uuid } = data;
      const downloadRef = this.downloadItems.find((item => item.uuid === uuid));
      if (downloadRef) {
        downloadRef.ref.pause();
      }
    } catch (error) {
      this.window.send(IpcEvents.DOWNLOAD_ERROR, { uuid: data.uuid, error });
      throw error;
    }
  }

  @ipcInvokeHandler(IpcEvents.DOWNLOAD_GET_PATH)
  async onGetDownloadPath() {
    return app.getPath('downloads');
  }
}

export default DownloadIpcCtrl;
