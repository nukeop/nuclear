import logger from 'electron-timber';

import { StreamQuery, StreamData } from '../plugins.types';
import StreamProviderPlugin from '../streamProvider';
import * as Youtube from '../../rest/Youtube';
class YoutubePlugin extends StreamProviderPlugin {
  constructor() {
    super();
    this.name = 'Youtube Plugin';
    this.sourceName = 'Youtube';
    this.description = 'A plugin allowing Nuclear to search for music and play it from Youtube';
    this.image = null;
    this.isDefault = true;
  }

  async search(query: StreamQuery): Promise<void | StreamData> {
    const terms = query.artist + ' ' + query.track;
    try {
      return await Youtube.trackSearch(logger)(query, undefined, this.sourceName);
    } catch (e) {
      logger.error(`Error while searching  for ${terms} on Youtube`);
      logger.error(e);
    }
  }

  async getAlternateStream(query: StreamQuery, currentStream: { id: string }): Promise<void | StreamData> {
    const terms = query.artist + ' ' + query.track;
    try {
      return await Youtube.trackSearch(logger)(query, currentStream.id, this.sourceName);
    } catch (e) {
      logger.error(`Error while looking up streams for ${terms} on Youtube`);
      logger.error(e);
    }
  }

  async getStreamForId(id: string): Promise<void | StreamData> {
    try {
      return await Youtube.getStreamForId(logger)(id, this.sourceName);
    } catch (e) {
      logger.error(`Error while looking up streams for id: ${id} on Youtube`);
      logger.error(e);
    }
  }
}

export default YoutubePlugin;
