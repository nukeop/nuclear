import MetaProvider from '../metaProvider';

class BandcampMetaProvider extends MetaProvider {
  constructor() {
    super();
    this.name = 'Bandcamp Meta Provider';
    this.sourceName = 'Bandcamp Meta Provider';
    this.description = 'Metadata provider that uses Bandcamp as a source.';
    this.searchName = 'Bandcamp';
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

export default BandcampMetaProvider;