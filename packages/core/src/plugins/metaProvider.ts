import Plugin from './plugin';

abstract class MetaProvider extends Plugin {
  sourceName: string;
  searchName: string;

  abstract searchForArtists(query: string): Promise<Array<SearchResultsArtist>>;
  abstract searchForReleases(query: string): Promise<Array<SearchResultsAlbum>>;
  abstract searchForTracks(query: string): Promise<Array<SearchResultsTrack>>;
  abstract searchAll(query: string): Promise<{
    artists: Array<SearchResultsArtist>;
    releases: Array<SearchResultsAlbum>;
    tracks: Array<SearchResultsTrack>;
  }>;
}

export default MetaProvider;
