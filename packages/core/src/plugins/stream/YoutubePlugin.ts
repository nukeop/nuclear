import { logger } from '../../';

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

  async search(query: StreamQuery): Promise<undefined | StreamData[]> {
    const terms = query.artist + ' ' + query.track;
    try {
      const tracks = await Youtube.trackSearch(query);

      return Promise.all(tracks.map(async track => {              
        return track;
      }));
    } catch (e) {
      logger.error(`Error while searching  for ${terms} on Youtube`);
      logger.error(e);
    }
  }

  async getStreamForId(id: string): Promise<undefined | StreamData> {
    try {
      const stream = await Youtube.getStreamForId(id, this.sourceName);
      return stream;
    } catch (e) {
      logger.error(`Error while looking up streams for id: ${id} on Youtube`);
      logger.error(e);      
    }
  }
}

export default YoutubePlugin;
