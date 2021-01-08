/* eslint-disable @typescript-eslint/no-explicit-any */
import registerDownloader, { download, Progress } from 'electron-dl';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import * as Youtube from '@nuclear/core/src/rest/Youtube';

import Store from '../store';
import Config from '../config';
import Window from '../window';
import { DownloadItem } from 'electron';

interface DownloadParams {
  query: string;
  filename: string;
  onStart: (item: DownloadItem) => void;
  onProgress: (progress: Progress) => any;
}

/**
 * Download file via youtube api with electron-dl
 * @see {@link https://github.com/sindresorhus/electron-dl}
 */
@injectable()
class Download {
  constructor(
    @inject(Window) private window: Window,
    @inject(Store) private store: Store,
    @inject(Config) private config: Config
  ) {
    registerDownloader();
  }

  /**
   * Download a soud using Youtube
   */
  async start({
    query,
    filename,
    onStart,
    onProgress
  }: DownloadParams): Promise<any> {
    const track = await Youtube.trackSearchByString(query);

    return download(this.window.getBrowserWindow(), track.stream, {
      filename: `${filename}.${track.format}`,
      directory: this.store.getOption('downloads.dir'),
      onStarted: onStart,
      onProgress: _.throttle(onProgress, 1000)
    });
  }
}

export default Download;
