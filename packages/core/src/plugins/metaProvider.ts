import Plugin from './plugin';
import {
  SearchResultsArtist,
  SearchResultsAlbum,
  SearchResultsTrack,
  SearchResultsPodcast,
  ArtistDetails,
  AlbumDetails
} from './plugins.types';

abstract class MetaProvider extends Plugin {
  sourceName: string;
  searchName: string;
  apiEndpoint?: string;

  abstract searchForArtists(query: string): Promise<Array<SearchResultsArtist>>;
  abstract searchForReleases(query: string): Promise<Array<SearchResultsAlbum>>;
  abstract searchForTracks(query: string): Promise<Array<SearchResultsTrack>>;
  abstract searchAll(query: string): Promise<{
    artists: Array<SearchResultsArtist>;
    releases: Array<SearchResultsAlbum>;
    tracks: Array<SearchResultsTrack>;
  }>;

  abstract fetchArtistDetails(artistId: string): Promise<ArtistDetails>;
  abstract fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails>;
  abstract fetchArtistAlbums(artistId: string): Promise<Array<SearchResultsAlbum>>;

  abstract fetchAlbumDetails(
    albumId: string, 
    albumType: ('master' | 'release'),
    resourceUrl?: string): Promise<AlbumDetails>;
  abstract fetchAlbumDetailsByName(
    albumName: string,
    albumType?: ('master' | 'release'),
    artist?: string
  ): Promise<AlbumDetails>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchForPodcast(query: string): Promise<Array<SearchResultsPodcast>> {
    return Promise.resolve([]);
  }
}

export default MetaProvider;
