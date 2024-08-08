import { SpotifyArtist, SpotifyClientProvider } from '../../rest/Spotify';
import MetaProvider from '../metaProvider';
import { SearchResultsArtist, SearchResultsAlbum, SearchResultsTrack, ArtistDetails, AlbumDetails, SearchResultsSource } from '../plugins.types';

export class SpotifyMetaProvider extends MetaProvider {
  constructor() {
    super();
    this.name = 'Spotify Meta Provider';
    this.searchName = 'Spotify';
    this.sourceName = 'Spotify Metadata Provider';
    this.description = 'Metadata provider that uses Spotify as a source.';
    this.image = null;
    this.isDefault = true;
  }
      
  async searchForArtists(query: string): Promise<SearchResultsArtist[]> {
    const results = await SpotifyClientProvider.get().searchArtists(query);

    return results.map(this.mapSpotifyArtist);
  }

  mapSpotifyArtist(spotifyArtist: SpotifyArtist): SearchResultsArtist {
    return {
      id: spotifyArtist.name,
      coverImage: spotifyArtist.images[0].url,
      thumb: spotifyArtist.images[0].url,
      name: spotifyArtist.name,
      source: SearchResultsSource.Spotify
    };
  }

  searchForReleases(query: string): Promise<SearchResultsAlbum[]> {
    return Promise.resolve([]);
  }
  searchForTracks(query: string): Promise<SearchResultsTrack[]> {
    return Promise.resolve([]);
  }
  searchAll(query: string): Promise<{ artists: SearchResultsArtist[]; releases: SearchResultsAlbum[]; tracks: SearchResultsTrack[]; }> {
    return Promise.resolve({
      artists: [],
      releases: [],
      tracks: []
    });
  }
  fetchArtistDetails(artistId: string): Promise<ArtistDetails> {
    throw new Error('');
  }
  fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails> {
    throw new Error('');
  }
  fetchArtistAlbums(artistId: string): Promise<SearchResultsAlbum[]> {
    throw new Error('');
  }
  fetchAlbumDetails(albumId: string, albumType: 'master' | 'release', resourceUrl?: string): Promise<AlbumDetails> {
    throw new Error('');
  }
  fetchAlbumDetailsByName(albumName: string, albumType?: 'master' | 'release', artist?: string): Promise<AlbumDetails> {
    throw new Error('');
  }
  
}
