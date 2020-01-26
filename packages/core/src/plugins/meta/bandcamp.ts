import MetaProvider from '../metaProvider';

class BandcampMetaProvider implements MetaProvider {
  image: string;
  name: 'Bandcamp Meta Provider';
  sourceName: 'Bandcamp Meta Provider';
  description: 'Metadata provider that uses Bandcamp as a source.';
  searchName: 'Bandcamp';
  
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