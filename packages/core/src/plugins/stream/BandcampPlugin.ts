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

  async findTrackUrls(query: StreamQuery): Promise<BandcampSearchResult[]> {
    const limit = 5;
    let tracks: BandcampSearchResult[];

    for (let page = 0; page < limit; page++) {
      const searchResults = await Bandcamp.search(query.track, page);
      tracks = searchResults.filter(item =>
        item.type === 'track' &&
        item.artist.toLowerCase() === query.artist.toLowerCase()
      );
      if (tracks) {
        break;
      }
    }
    return tracks;
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

  async search(query: StreamQuery): Promise<undefined | StreamData[]> {
    try {
      const tracks = await this.findTrackUrls(query);

      return Promise.all(tracks.map(async track => {
        const { stream, duration } = await Bandcamp.getTrackData(track.url);
        return this.resultToStream(track, stream, duration);
      }));
    } catch (error) {
      logger.error(`Error while searching  for ${query.artist + ' ' + query.track} on Bandcamp`);
      logger.error(error);
    }
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
