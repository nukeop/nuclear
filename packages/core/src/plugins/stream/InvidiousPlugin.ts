import logger from 'electron-timber';
import _ from 'lodash';

import StreamProviderPlugin from '../streamProvider';
import * as Invidious from '../../rest/Invidious';
import { StreamQuery, StreamData } from '../plugins.types';

class InvidiousPlugin extends StreamProviderPlugin {
  constructor() {
    super();
    this.name = 'Invidious Plugin';
    this.sourceName = 'Invidious';
    this.description = 'A plugin allowing Nuclear to search for music and play it from invidious';
    this.baseUrl = Invidious.baseUrl;
    this.image = null;
  }

  async search(query: StreamQuery): Promise<void | StreamData> {
    const terms = query.artist + ' ' + query.track;
    try {
      const res = await Invidious.trackSearch(terms);

      const {
        adaptiveFormats,
        lengthSeconds,
        title,
        videoId,
        videoThumbnails
      } = res;

      return {
        source: this.sourceName,
        id: videoId,
        stream: adaptiveFormats.find(({ container, type }) => type.includes('audio') && container === 'webm').url,
        duration: lengthSeconds,
        title,
        thumbnail: videoThumbnails[3].url,
        originalUrl: `${this.baseUrl}/watch?v=${videoId}`
      };
    } catch (error) {
      logger.error(`Error while searching  for ${terms} on Invidious`);
      logger.error(error);
    }
  }

  async getAlternateStream(query: StreamQuery, currentStream): Promise<void | StreamData> {
    const terms = query.artist + ' ' + query.track;
    try {
      const {
        adaptiveFormats,
        lengthSeconds,
        title,
        videoId,
        videoThumbnails
      } = await Invidious.trackSearch(terms, currentStream);

      return {
        source: this.sourceName,
        id: videoId,
        stream: adaptiveFormats.find(({ container, type }) => type.includes('audio') && container === 'webm').url,
        duration: lengthSeconds,
        title,
        thumbnail: _.get(videoThumbnails.find(({ quality }) => quality === 'maxresdefault'), 'url'),
        originalUrl: `${this.baseUrl}/watch?v=${videoId}`
      };
    } catch (error) {
      logger.error(`Error while searching  for ${terms} on Invidious`);
      logger.error(error);
    }
  }
}

export default InvidiousPlugin;
