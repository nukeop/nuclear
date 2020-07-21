/* eslint-disable @typescript-eslint/no-explicit-any */
import registerDownloader, { download, Progress } from 'electron-dl';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import * as Invidious from '@nuclear/core/src/rest/Invidious';

import Store from '../store';
import Config from '../config';
import Window from '../window';
import { DownloadItem } from 'electron';

interface DownloadParams {
  query: any;
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
   * Download a soud using the Invidious api
   */
  async start({
    query,
    filename,
    onStart,
    onProgress
  }: DownloadParams): Promise<any> {
    const {
      adaptiveFormats
    } = await Invidious.trackSearch(query);
    const streams = adaptiveFormats.filter(
      ({ type }: { type: string }) => type.includes('audio')
    );
    const bestStream = _.maxBy(streams, (stream: { bitrate: string }) => Number(stream.bitrate));

    return download(this.window.getBrowserWindow(), _.get(bestStream, 'url'), {
      filename: filename + `.${_.get(bestStream, 'container')}`,
      directory: this.store.getOption('downloads.dir'),
      onStarted: onStart,
      onProgress: _.throttle(onProgress, 1000)
    });
  }
}

export default Download;
