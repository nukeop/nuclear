import { Bandcamp } from '../../rest';
import { BandcampSearchResult } from '../../rest/Bandcamp';
import { StreamQuery, StreamData } from '../plugins.types';
import logger from 'electron-timber';
import StreamProviderPlugin from '../streamProvider';

class BandcampPlugin extends StreamProviderPlugin {
  constructor() {
    super();
    this.name = 'Bandcamp Plugin';
    this.sourceName = 'Bandcamp';
    this.description = 'A plugin allowing Nuclear to search for music and play it from Bandcamp';
    this.image = null;
    this.isDefault = false;
  }

  async findTrackUrl(query: StreamQuery): Promise<BandcampSearchResult> {
    const limit = 5;
    let track: BandcampSearchResult;

    for (let page = 0; page < limit; page++) {
      const searchResults = await Bandcamp.search(query.track, page);
      track = searchResults.find(item =>
        item.type === 'track' &&
        item.artist.toLowerCase() === query.artist.toLowerCase()
      );
      if (track) {
        break;
      }
    }
    return track;
  }

  resultToStream(result: BandcampSearchResult, stream: string, duration: number): StreamData {
    return {
      source: this.sourceName,
      id: btoa(result.url),
      stream,
      duration,
      title: result.name,
      thumbnail: result.imageUrl,
      originalUrl: result.url
    };
  }

  async search(query: StreamQuery): Promise<undefined | StreamData> {
    try {
      const track = await this.findTrackUrl(query);
      const { stream, duration } = await Bandcamp.getTrackData(track.url);

      return this.resultToStream(track, stream, duration);
    } catch (error) {
      logger.error(`Error while searching  for ${query.artist + ' ' + query.track} on Bandcamp`);
      logger.error(error);
    }
  }

  async getAlternateStream(query: StreamQuery): Promise<undefined | StreamData> {
    return this.search(query);
  }

  async getStreamForId(id: string): Promise<undefined | StreamData> {
    try {
      const trackUrl = atob(id);
      const track = await Bandcamp.getTrackData(trackUrl);

      return this.resultToStream(track, track.stream, track.duration);
    } catch (error) {
      logger.error(`Error while searching id: ${id} on Bandcamp`);
      logger.error(error);
    }
  }
}

export default BandcampPlugin;
