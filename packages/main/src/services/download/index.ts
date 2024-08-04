/* eslint-disable @typescript-eslint/no-explicit-any */
import registerDownloader, { download, Options } from 'electron-dl';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import * as Youtube from '@nuclear/core/src/rest/Youtube';
import { StreamQuery } from '@nuclear/core/src/plugins/plugins.types';

import Store from '../store';
import Config from '../config';
import Window from '../window';
import { DownloadItem } from 'electron';

type DownloadParams = {
  query: StreamQuery;
  filename: string;
} & Pick<Options, 'onStarted' | 'onProgress' | 'onCompleted'>

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
   * Download a track using Youtube
   */
  async start({
    query,
    filename,
    onStarted,
    onProgress,
    onCompleted
  }: DownloadParams): Promise<any> {
    const tracks = await Youtube.trackSearchByString(query, undefined, false);
    const videoWithStream = await Youtube.getStreamForId(tracks[0]?.id, undefined);

    return download(this.window.getBrowserWindow(), videoWithStream?.stream, {
      filename: `${filename}.${videoWithStream?.format}`,
      directory: this.store.getOption('downloads.dir'),
      onStarted,
      onProgress: _.throttle(onProgress, 1000),
      onCompleted
    });
  }
}

export default Download;
