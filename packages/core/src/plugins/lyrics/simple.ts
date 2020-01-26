import logger from 'electron-timber';
import lyrics from 'simple-get-lyrics';

import LyricsProvider from '../lyricsProvider';

class SimpleLyricsProvider implements LyricsProvider {
  name: 'Simple Lyrics Provider Plugin';
  sourceName: 'Simple Lyrics Provider';
  description: 'Simple lyrics provider plugin. Uses several sources with fallbacks.';
  image: null;

  search(artistName: string, trackName: string): string {
    return lyrics.search(artistName, trackName)
      .then(result => result.lyrics).catch(function (err) {
        logger.log('error', err);
      });
  }
}

export default SimpleLyricsProvider;
