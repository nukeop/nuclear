import { SoytifyClientProvider } from '../../../rest/soytify/soytify-partners-api';
import MetaProvider from '../../metaProvider';
import { SearchResultsAlbum, SearchResultsTrack, SearchResultsArtist, ArtistDetails, AlbumDetails } from '../../plugins.types';

const SOYTIFY_NAME = atob('U295dGlmeQ==');

export class SoytifyMetaProvider extends MetaProvider {
  constructor() {
    super();
    this.name = SOYTIFY_NAME + ' Meta Provider';
    this.searchName = SOYTIFY_NAME;
    this.sourceName = SOYTIFY_NAME + ' Metadata Provider';
    this.description = 'Metadata provider that uses ' + SOYTIFY_NAME + ' as a source.';
    this.image = null;
    this.isDefault = false;
  }

  async searchForArtists(query: string): Promise<Array<SearchResultsArtist>> {
    const client = await SoytifyClientProvider.get();
    const artists = await client.searchArtists(query);
    return artists;
  }

  async searchForReleases(query: string): Promise<Array<SearchResultsAlbum>> {
    const client = await SoytifyClientProvider.get();
    return client.searchReleases(query);
  }
  
  async searchForTracks(query: string): Promise<Array<SearchResultsTrack>> {
    const client = await SoytifyClientProvider.get();
    return client.searchTracks(query);
  }

  async searchAll(query: string): Promise<{ artists: Array<SearchResultsArtist>; releases: Array<SearchResultsAlbum>; tracks: Array<SearchResultsTrack>; }> {
    const client = await SoytifyClientProvider.get();
    return await client.searchAll(query);
  }

  async fetchArtistDetails(artistId: string): Promise<ArtistDetails> {
    const client = await SoytifyClientProvider.get();
    return client.fetchArtistDetails(artistId);
  }
  fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails> {
    throw new Error('Method not implemented.');
  }
  fetchArtistAlbums(artistId: string): Promise<Array<SearchResultsAlbum>> {
    throw new Error('Method not implemented.');
  }
  fetchAlbumDetails(albumId: string, albumType: ('master' | 'release'), resourceUrl?: string): Promise<AlbumDetails> {
    throw new Error('Method not implemented.');
  }
  fetchAlbumDetailsByName(albumName: string, albumType?: ('master' | 'release'), artist?: string): Promise<AlbumDetails> {
    throw new Error('Method not implemented.');
  }
}
