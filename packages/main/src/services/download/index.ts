/* eslint-disable @typescript-eslint/no-explicit-any */
import registerDownloader, { download, Progress } from 'electron-dl';
import { inject, injectable } from 'inversify';
import fetch from 'node-fetch';
import _ from 'lodash';
import ytdl from 'ytdl-core';

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

  async youtubeSearch(query: any): Promise<any> {
    const response = await fetch(
      `${this.config.youtubeSearch}${encodeURIComponent(query)}&key=${ this.store.getOption('yt.apiKey')}`
    );

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error.errors[0].reason);
    }

    return response.json();
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
    const ytData = await this.youtubeSearch(query);
    const trackId = _.get(_.head(ytData.items), 'id.videoId');
    const videoInfo = await ytdl.getInfo(`${this.config.youtubeUrl}?v=${trackId}`);
    const formatInfo = _.head(videoInfo.formats.filter(e => (e.itag as unknown) === 140)) as ytdl.videoFormat;
    const streamUrl = formatInfo.url;

    return download(this.window.getBrowserWindow(), streamUrl, {
      filename: filename + `.${_.get(formatInfo, 'container')}`,
      directory: this.store.getOption('downloads.dir'),
      onStarted: onStart,
      onProgress: _.throttle(onProgress, 1000)
    });
  }
}

export default Download;
