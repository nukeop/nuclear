import Plugin from './plugin';
import {
  SearchResultsArtist,
  SearchResultsAlbum,
  SearchResultsTrack,
  ArtistDetails,
  AlbumDetails
} from './plugins.types';

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

  abstract fetchArtistDetails(artistId: string): Promise<ArtistDetails>;
  abstract fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails>;
  abstract fetchArtistAlbums(artistId: string): Promise<Array<SearchResultsAlbum>>;

  abstract fetchAlbumDetailsByName(albumName: string): Promise<AlbumDetails>;
}

export default MetaProvider;
