import logger from 'electron-timber';
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
      thumbnail: result.artworkUrl600
    };
  }

  async findPodcastId(podcast: string): Promise<string> {
    return iTunes.podcastSearch(podcast, '50')
      .then(data => data.json())
      .then(results => {
        const infoPodcast = _.find(results.results, result => result && result.collectionName === podcast);
        return infoPodcast.collectionId;
      }).catch(err => {
        logger.error(`Error while looking up podcast for ${podcast} on iTunes`);
        logger.error(err);
      });
  }

  async search(query: StreamQuery): Promise<void | StreamData> {
    const podcast = query.artist;
    const episode = query.track;
    const podcastId = await this.findPodcastId(podcast);
    return iTunes.getPodcastEpisodes(podcastId, '50')
      .then(data => data.json())
      .then(results => {
        const infoEpisode = _.find(results.results, result => 
          result && 
          result.trackName === episode && 
          result.wrapperType === 'podcastEpisode');
        return infoEpisode ? this.resultToStream(infoEpisode) : null;
      }).catch(err => {
        logger.error(`Error while looking up podcast for ${podcast} on iTunes`);
        logger.error(err);
      });
  }

  async getAlternateStream(query: StreamQuery, currentStream: { id: string; }): Promise<void | StreamData> {
    const podcast = query.artist;
    const podcastId = await this.findPodcastId(podcast);
    return iTunes.getPodcastEpisodes(podcastId, '50')
      .then(data => data.json())
      .then(results => {
        const infoEpisode = _.find(results.results, result => 
          result && 
          result.trackId !== currentStream.id && 
          result.wrapperType === 'podcastEpisode');
        return infoEpisode ? this.resultToStream(infoEpisode) : null;
      }).catch(err => {
        logger.error(`Error while looking up podcast for ${podcast} on iTunes`);
        logger.error(err);
      });
  }
}

export default iTunesPodcastPlugin;
