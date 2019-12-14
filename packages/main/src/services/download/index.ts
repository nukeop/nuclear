/* eslint-disable @typescript-eslint/no-explicit-any */
import electronDl, { download } from 'electron-dl';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import ytdl from 'ytdl-core';

import Store from '../store';
import Config from '../config';
import Window from '../window';

interface DownloadParams {
  query: any;
  filename: string;
  onStart: () => void;
  onProgress: (progress: number) => void;
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
    electronDl();
  }

  youtubeSearch(query: any): Promise<any> {
    return fetch(
      `${this.config.youtubeSearch}${encodeURIComponent(query)}&key=${ this.store.getOption('yt.apiKey')}`
    );
  }

  /**
   * Download a soud using the youtube api
   */
  async start({
    query,
    filename,
    onStart,
    onProgress
  }: DownloadParams): Promise<any> {
    const response = await this.youtubeSearch(query);
    const ytData = await response.json();
    const trackId = _.get(_.head(ytData.items), 'id.videoId');
    const videoInfo = await ytdl.getInfo(`${this.config.youtubeUrl}?v=${trackId}`);
    const formatInfo = _.head(videoInfo.formats.filter(e => (e.itag as unknown) === 140)) as ytdl.videoFormat;
    const streamUrl = formatInfo.url;

    return download(this.window, streamUrl, {
      filename: filename + `.${_.get(formatInfo, 'container')}`,
      directory: this.store.getOption('downloads.dir'),
      onStarted: onStart,
      onProgress: _.throttle(onProgress, 1000)
    });
  }
}

export default Download;
