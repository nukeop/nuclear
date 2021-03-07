import logger from 'electron-timber';

import { StreamQuery } from '../plugins.types';
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

  async search(query: StreamQuery) {
    const terms = query.artist + ' ' + query.track;
    try {
      return await Youtube.trackSearch(query, undefined, this.sourceName);
    } catch (e) {
      logger.error(`Error while searching  for ${terms} on Youtube`);
      logger.error(e);
    }
  }

  async getAlternateStream(query: StreamQuery, currentStream: { id: string }) {
    const terms = query.artist + ' ' + query.track;
    try {
      return await Youtube.trackSearch(query, currentStream.id, this.sourceName);
    } catch (e) {
      logger.error(`Error while looking up streams for ${terms} on Youtube`);
      logger.error(e);
    }
  }

  async getStreamForId(id: string) {
    return Youtube.getStreamForId(id);
  }
}

export default YoutubePlugin;
