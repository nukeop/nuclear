import MetaProvider from '../metaProvider';

class BandcampMetaProvider extends MetaProvider {
  constructor() {
    super();
    this.name = 'Bandcamp Meta Provider';
    this.sourceName = 'Bandcamp Meta Provider';
    this.description = 'Metadata provider that uses Bandcamp as a source.';
    this.searchName = 'Bandcamp';
    this.image = null;
  }

  searchForArtists(query): Promise<Array<SearchResultsArtist>> {
    throw new Error("Method not implemented.");
  }

  searchForReleases(query): Promise<Array<SearchResultsAlbum>> {
    throw new Error("Method not implemented.");
  }

  searchForTracks(query): Promise<SearchResultsTrack[]> {
    throw new Error("Method not implemented.");
  }

  searchAll(query): Promise<{
    artists: Array<SearchResultsArtist>;
    releases: Array<SearchResultsAlbum>;
    tracks: Array<SearchResultsTrack>;
  }> {
    throw new Error("Method not implemented.");
  }
}

export default BandcampMetaProvider;