import Plugin from './plugin';

interface MetaProvider extends Plugin {
  sourceName: string;
  searchName: string;

  searchForArtists: SearchForArtistsFunc;
  searchForReleases: SearchForReleasesFunc;
  searchForTracks: SearchForTracksFunc;
  searchAll: SearchAllFunc;
}

interface SearchForArtistsFunc {
  (query: string): Promise<Array<SearchResultsArtist>>;
}

interface SearchForReleasesFunc {
  (query: string): Promise<Array<SearchResultsAlbum>>;
}

interface SearchForTracksFunc {
  (query: string): Promise<Array<SearchResultsTrack>>
}

interface SearchAllFunc {
  (query: string): Promise<{
    artists: Array<SearchResultsArtist>;
    releases: Array<SearchResultsAlbum>;
    tracks: Array<SearchResultsTrack>;
  }>;
}

export default MetaProvider;
