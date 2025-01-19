import { logger } from '../../';
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

  async search(query: StreamQuery): Promise<undefined | StreamData[]> {
    const terms = query.artist + ' ' + query.track;
    try {
      const res = await Invidious.trackSearch(terms);
      return Promise.all(res.map(track => this.resultToStream(track)));
    } catch (error) {
      logger.error(`Error while searching  for ${terms} on Invidious`);
      logger.error(error);
    }
  }

  async getStreamForId(id: string): Promise<undefined | StreamData> {
    try {
      const res = await Invidious.getTrackInfo(id);

      return this.resultToStream(res);
    } catch (error) {
      logger.error(`Error while searching id ${id} on Invidious`);
      logger.error(error);
    }
  }

  resultToStream(result): StreamData {
    const {
      adaptiveFormats,
      lengthSeconds,
      title,
      videoId,
      videoThumbnails
    } = result;

    return {
      source: this.sourceName,
      id: videoId,
      stream: adaptiveFormats.find(({ container, type }) => type.includes('audio') && container === 'webm').url,
      duration: lengthSeconds,
      title,
      thumbnail: videoThumbnails[3].url,
      originalUrl: `${this.baseUrl}/watch?v=${videoId}`
    };
  }
}

export default InvidiousPlugin;
