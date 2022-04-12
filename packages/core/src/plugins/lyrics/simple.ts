import logger from 'electron-timber';
import lyrics from 'get-lyrics-hd';

import LyricsProvider from '../lyricsProvider';

class SimpleLyricsProvider extends LyricsProvider {
  constructor() {
    super();
    this.name = 'Simple Lyrics Provider Plugin';
    this.sourceName = 'Simple Lyrics Provider';
    this.description = 'Simple lyrics provider plugin. Uses several sources with fallbacks.';
    this.image = null;
    this.isDefault = true;
  }

  search(artistName: string, trackName: string): Promise<string | void> {
    return lyrics.search(artistName, trackName)
      .then(result => result.lyrics).catch(function (err) {
        logger.log('error', err);
      });
  }
}

export default SimpleLyricsProvider;
