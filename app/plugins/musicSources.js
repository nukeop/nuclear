import logger from 'electron-timber';

import Plugin from './plugin';

class MusicSourcePlugin extends Plugin {
  constructor() {
    super();
    this.name = 'Music Source Plugin';
    this.sourceName = 'Generic Music Source';
    this.description = 'A generic music source plugin. Should never be instantiated directly';
    this.image = null;
  }

  search(query) {
    /*
    query is an object : 
    {
      artist : 'The artist name,
      track : 'The track to search'
    }
    */
    logger.error('search not implemented in plugin ' + this.name + 
    '\n Query was: ' + query);
  }

  getAlternateStream(query, currentStream) {
    logger.error('getAlternateStream not implemented in plugin ' + this.name +
    '\n Query was: ' + query +
    '\n CurrentStream was: ' + currentStream);
  }
}

export default MusicSourcePlugin;
