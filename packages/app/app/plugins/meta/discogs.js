import MetaProvider from '../metaProvider';

class DiscogsMetaProvider extends MetaProvider {
  constructor() {
    super();
    this.name = 'Discogs Meta Provider';
    this.sourceName = 'Discogs Metadata Provider';
    this.description = 'Metadata provider that uses Discogs as a source.';
    this.image = null;
  }

  searchForArtists() {
    return new Promise();
  }

  searchForReleases() {
    return new Promise();
  }

  searchAll() {
    return new Promise();
  }
}

export default DiscogsMetaProvider;
