import logger from 'electron-timber';
import { Plugin } from '@nuclear/core';

class MetaProvider extends Plugin {
  constructor() {
    super();
    this.name = 'Meta Provider Plugin';
    this.sourceName = 'Generic Metadata Provider';
    this.description = 'A generic metadata provider plugin. Should never be instantiated directly';
    this.searchName = 'Generic';
    this.image = null;
  }

  searchForArtists(query) {
    logger.error(`Search not implemented in plugin ${this.name}\n Query was: ${query}`);
  }

  searchForReleases(query) {
    logger.error(`Search not implemented in plugin ${this.name}\n Query was: ${query}`);
  }

  searchAll(query) {
    logger.error(`Search not implemented in plugin ${this.name}\n Query was: ${query}`);
  }
}

export default MetaProvider;
