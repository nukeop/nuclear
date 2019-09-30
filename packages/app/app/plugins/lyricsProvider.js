import logger from 'electron-timber';

import Plugin from './plugin';

class LyricsProvider extends Plugin {
  constructor() {
    super();
    this.name = 'Lyrics Provider Plugin';
    this.sourceName = 'Generic Lyrics Provider';
    this.description = 'A generic lyrics provider plugin. Should never be instantiated directly';
    this.image = null;
  }

  search(artistName, trackName) {
    logger.error(`Search not implemented in plugin ${this.name}\n Query was: ${artistName}, ${trackName}`);
  }
}

export default LyricsProvider;
