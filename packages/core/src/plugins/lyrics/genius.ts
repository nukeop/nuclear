import Genius from 'genius-lyrics';

import LyricsProvider from '../lyricsProvider';

class GeniusClientProvider {
    private static client: Genius.Client;
    private constructor() {}

    static get(): Genius.Client {
      if (!GeniusClientProvider.client) {
        GeniusClientProvider.client = new Genius.Client();
      }
      return GeniusClientProvider.client;
    }
}

export default class GeniusLyricsProvider extends LyricsProvider {
  constructor() {
    super();
    this.name = 'Genius Lyrics Provider Plugin';
    this.sourceName = 'Genius Lyrics Provider';
    this.description = 'Genius lyrics provider plugin. Uses Genius API.';
    this.image = null;
    this.isDefault = false;
  }
    
  async search(artistName: string, trackName: string): Promise<string | void> {
    const searchResults = await GeniusClientProvider.get().songs.search(`${artistName} ${trackName}`);
    if (searchResults.length > 0) {
      const bestResult = searchResults[0];
      return bestResult.lyrics();
    }

    return undefined;
  }
}
