import logger from 'electron-timber';
import az from 'search-azlyrics';

import LyricsProvider from '../lyricsProvider';

class AZLyricsProvider extends LyricsProvider {
  constructor() {
    super();
    this.name = 'AZ Lyrics Provider Plugin';
    this.sourceName = 'AZ Lyrics Provider';
    this.description = 'AZ lyrics provider plugin. Uses search result from azlyrics';
    this.image = null;
    this.isDefault = false;
  }

  search(artistName: string, trackName: string): string {
    return az.search(artistName, trackName)
      .then(result => result).catch(function (err) {
        logger.log('error', err);
      });
  }
}

export default AZLyricsProvider;
