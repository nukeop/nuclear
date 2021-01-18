import { Bandcamp } from '../../rest';
import { BandcampSearchResult } from '../../rest/Bandcamp';
import { StreamQuery, StreamData } from '../plugins.types';
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
      thumbnail: result.imageUrl
    };
  }

  async search(query: StreamQuery): Promise<void | StreamData> {
    const track = await this.findTrackUrl(query);
    const { stream, duration } = await Bandcamp.getTrackData(track.url);
    return this.resultToStream(track, stream, duration);
  }

  async getAlternateStream(query: StreamQuery): Promise<void | StreamData> {
    return this.search(query);
  }
}

export default BandcampPlugin;
