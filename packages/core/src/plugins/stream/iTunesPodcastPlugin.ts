import { logger } from '../../';
import _ from 'lodash';

import { StreamData, StreamQuery } from '../plugins.types';
import StreamProviderPlugin from '../streamProvider';
import * as iTunes from '../../rest/iTunes';

class iTunesPodcastPlugin extends StreamProviderPlugin {
  constructor() {
    super();
    this.name = 'iTunes Podcast Plugin';
    this.sourceName = 'iTunes';
    this.description = 'Allows Nuclear to find podcast streams on iTunes';
    this.image = null;
  }

  resultToStream(result): StreamData {
    return {
      source: this.sourceName,
      id: result.trackId,
      stream: result.episodeUrl,
      duration: result.trackTimeMillis / 1000,
      title: result.trackName,
      thumbnail: result.artworkUrl600,
      originalUrl: result.trackViewUrl
    };
  }

  async findPodcastId(podcast: string): Promise<string> {
    try {
      const results = await(await iTunes.podcastSearch(podcast, '50')).json();
      const infoPodcast = _.find(results.results, result => result && result.collectionName === podcast);
      return infoPodcast.collectionId;
    } catch (err) {
      logger.error(`Error while looking up podcast for ${podcast} on iTunes`);
      logger.error(err);
    }
  }

  async search(query: StreamQuery): Promise<undefined | StreamData[]> {
    const podcast = query.artist;
    const episode = query.track;
    const podcastId = await this.findPodcastId(podcast);

    try {
      const results = await(await iTunes.getPodcastEpisodes(podcastId, '50')).json();
      const infoEpisode = _.find(results.results, result => 
        result && 
          result.trackName === episode && 
          result.wrapperType === 'podcastEpisode');
      return infoEpisode ? [this.resultToStream(infoEpisode)] : null;
    } catch (err) {
      logger.error(`Error while looking up podcast for ${podcast} on iTunes`);
      logger.error(err);
    }
  }

  async getStreamForId(): Promise<undefined | StreamData> {
    return undefined;
  }
}

export default iTunesPodcastPlugin;
