import SoundcloudScraper from 'soundcloud-scraper';

import { StreamData, StreamQuery } from '../plugins.types';
import StreamProviderPlugin from '../streamProvider';

class SoundcloudPlugin extends StreamProviderPlugin {
  constructor() {
    super();
    this.name = 'Soundcloud Plugin';
    this.sourceName = 'Soundcloud';
    this.description = 'Allows Nuclear to find music streams on Soundcloud';
    this.image = null;
  }

  resultToStream(result): StreamData {
    
    return {
      source: this.sourceName,
      id: result.trackURL,
      stream: result.streamURL,
      duration: result.duration/1000,
      title: result.title,
      thumbnail: result.thumbnail,
      originalUrl: result.trackURL
    };
  }

  async search(query: StreamQuery): Promise<StreamData | void> {
    const terms = query.artist + ' ' + query.track;
    const client = new SoundcloudScraper.Client(undefined, { fetchAPIKey: true });
    const searchResult = (await client.search(terms, 'track'))[0];
    const result = client.getSongInfo(searchResult.url);
    return this.resultToStream(result);
  }

  getAlternateStream(query: StreamQuery): Promise<StreamData | void> {
    return this.search(query);
  }

  async getStreamForId(id: string): Promise<void | StreamData> {
    const client = new SoundcloudScraper.Client(undefined, { fetchAPIKey: true });
    const result = client.getSongInfo(id);
    return this.resultToStream(result);
  }
}

export default SoundcloudPlugin;
