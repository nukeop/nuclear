import MetaProvider from '../metaProvider';
import * as iTunes from '../../rest/iTunesPodcast';
import { 
  SearchResultsArtist, 
  SearchResultsAlbum, 
  SearchResultsTrack, 
  ArtistDetails, 
  AlbumDetails,
  SearchResultsSource 
} from '../plugins.types';
import LastFmApi from '../../rest/Lastfm';

class iTunespodcastMetaProvider extends MetaProvider {
  lastfm: LastFmApi;
  constructor() {
    super();
    this.name = 'iTunespodcast Meta Provider';
    this.sourceName = 'iTunespodcast Meta Provider';
    this.description = 'Metadata provider that uses iTunes as a source.';
    this.searchName = 'iTunespodcast';
    this.image = null;
    this.lastfm = new LastFmApi(process.env.LAST_FM_API_KEY, process.env.LASTFM_API_SECRET);
  }

  searchForArtists(query: string): Promise<Array<SearchResultsArtist>> {
    return iTunes.podcastSearch(query, '50')
      .then(response => response.json())
      .then(response => response.results.map(podcast => ({
        id: `${podcast.collectionId}`,
        coverImage: '',
        thumb: '',
        name: podcast.trackName,
        source: SearchResultsSource.iTunesPodcast
      })));
  }

  async searchForReleases(query: string): Promise<SearchResultsAlbum[]> {
    await this.searchForTracks(query);
    return Promise.resolve([]);
  }

  searchForTracks(query: string): Promise<SearchResultsTrack[]> {
    return iTunes.podcastSearch(query, '50')
      .then(response => response.json())
      .then((json) => json.results.map(podcast => ({
        id: podcast.collectionId,
        title: podcast.collectionName,
        artist: podcast.collectionName,
        source: SearchResultsSource.iTunesPodcast
      })));
  }

  async searchAll(query: string): Promise<{ 
    artists: SearchResultsArtist[]; 
    releases: SearchResultsAlbum[]; 
    tracks: SearchResultsTrack[]; 
  }> {
    const artists = await this.searchForArtists(query);
    const releases = await this.searchForReleases(query);
    const tracks = await this.searchForTracks(query);
    return Promise.resolve({ artists, releases, tracks });
  }

  async fetchArtistDetails(artistId: string): Promise<ArtistDetails> {
    // Se supone que debe recibir el mismo id que en searchForArtists
    console.log(artistId);
  }

  async fetchArtistDetailsByName(): Promise<ArtistDetails> {
    throw new Error('Method not implemented.');
  }

  async fetchArtistAlbums(artistId: string): Promise<SearchResultsAlbum[]> {
    // Se supone que debe recibir el mismo id que en searchForArtists
    console.log(artistId);
  }

  fetchAlbumDetails(): Promise<AlbumDetails> {
    throw new Error('Method not implemented.');
  }

  fetchAlbumDetailsByName(): Promise<AlbumDetails> {
    throw new Error('Method not implemented.');
  }
}

export default iTunespodcastMetaProvider;
