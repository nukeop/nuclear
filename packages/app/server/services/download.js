import 'isomorphic-fetch';
import electronDl, { download } from 'electron-dl';
import ytdl from 'ytdl-core';
import _ from 'lodash';

/**
 * @typedef {Object} DownloadParams
 * @property {Object} query
 * @property {string} filename
 * @property {() => void} onStart
 * @property {(progress: number) => void} onProgress
 */

/**
 * Download file via youtube api with electron-dl
 * @see {@link https://github.com/sindresorhus/electron-dl}
 */
class Download {
  constructor({ window, youtubeSearch, store }) {
    electronDl();
    /** @type {import('./window').default} */
    this.window = window;
    /** @type {(query: any) => Promise} */
    this.youtubeSearch = youtubeSearch;
    /** @type {import('./store').default} */
    this.store = store;
  }

  /**
   * Download a soud using the youtube api
   * @param {DownloadParams} param0
   * @returns {Promise}
   */
  async start({
    query,
    filename,
    onStart,
    onProgress
  }) {
    const response = await this.youtubeSearch(query);
    const ytData = await response.json();
    const trackId = _.get(_.head(ytData.items), 'id.videoId');
    const videoInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${trackId}`);
    const formatInfo = _.head(videoInfo.formats.filter(e => e.itag === 140));
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
