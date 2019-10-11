import MetaProvider from '../metaProvider';

class DiscogsMetaProvider extends MetaProvider {
  constructor() {
    super();
    this.name = 'Discogs Meta Provider';
    this.sourceName = 'Discogs Metadata Provider';
    this.description = 'Metadata provider that uses Discogs as a source.';
    this.image = null;
  }

  searchForArtists(query) {
    return new Promise();
  }

  searchForReleases(query) {
    return new Promise();
  }

  searchAll(query) {
    return new Promise();
  }
}

export default DiscogsMetaProvider;
