import logger from 'electron-timber';

import StreamProviderPlugin from '../streamProvider';
import * as Invidious from '../../rest/Invidious';
import YoutubePlugin from './YoutubePlugin';

class InvidiousPlugin extends StreamProviderPlugin {
  constructor() {
    super();
    this.name = 'Invidious Plugin';
    this.sourceName = 'Invidious';
    this.description = 'A plugin allowing Nuclear to search for music and play it from invidious';
    this.youtubePlugin = new YoutubePlugin();
  }

  async search(query) {
    const terms = query.artist + ' ' + query.track;
    try {
      const {
        adaptiveFormats,
        lengthSeconds,
        title,
        videoId,
        videoThumbnails
      } = await Invidious.trackSearch(terms);

      return {
        source: this.sourceName,
        id: videoId,
        stream: adaptiveFormats.find(({ container, type }) => type.includes('audio') && container === 'webm').url,
        duration: lengthSeconds,
        title,
        thumbnail: videoThumbnails[3].url
      };
    } catch (error) {
      logger.error(`Error while searching  for ${terms} on Invidious, try on Youtube`);
      logger.error(error);
      return this.youtubePlugin.search(query);
    }
  }

  async getAlternateStream(query) {
    const terms = query.artist + ' ' + query.track;
    try {
      const {
        adaptiveFormats,
        lengthSeconds,
        title,
        videoId,
        videoThumbnails
      } = await Invidious.trackSearch(terms, true);

      return {
        source: this.sourceName,
        id: videoId,
        stream: adaptiveFormats.find(({ type }) => type.includes('audio')).url,
        duration: lengthSeconds,
        title,
        thumbnail: videoThumbnails[3].url
      };
    } catch (error) {
      logger.error(`Error while searching  for ${terms} on Invidious`);
      logger.error(error);
      return this.youtubePlugin.search(query);
    }
  }
}

export default InvidiousPlugin;
