import MetaProvider from '../metaProvider';
import * as Discogs from '../../rest/Discogs';
import LastFmApi from '../../rest/Lastfm';
import {
  SearchResultsArtist,
  SearchResultsAlbum,
  SearchResultsTrack,
  SearchResultsSource,
  ArtistDetails,
  AlbumDetails
} from '../plugins.types';
import {
  DiscogsArtistInfo
} from '../../rest/Discogs.types';

const SEARCH_TYPE = Object.freeze({
  ARTIST: 'artist',
  MASTER: 'master',
  RELEASE: 'release'
});

class DiscogsMetaProvider extends MetaProvider {
  lastfm: LastFmApi;
  constructor() {
    super();
    this.name = 'Discogs Meta Provider';
    this.searchName = 'Discogs';
    this.sourceName = 'Discogs Metadata Provider';
    this.description = 'Metadata provider that uses Discogs as a source.';
    this.image = null;
    this.lastfm = new LastFmApi(process.env.LAST_FM_API_KEY, process.env.LASTFM_API_SECRET);
  }
  
  searchForArtists(query: string): Promise<Array<SearchResultsArtist>> {
    return Discogs.search(query, SEARCH_TYPE.ARTIST)
    .then(response => response.json())
    .then(json => json.map(artist => ({
      ...artist,
      source: SearchResultsSource.Discogs
    })));
  }
  
  searchForReleases(query: string): Promise<Array<SearchResultsAlbum>> {
    return Discogs.search(query, SEARCH_TYPE.MASTER)
    .then(response => response.json())
    .then(json => json.map(album => ({
      ...album,
      source: SearchResultsSource.Discogs
    })));
  }
  
  searchForTracks(query: string): Promise<Array<SearchResultsTrack>> {
    return Promise.resolve([]);
  }
  
  searchAll(query): Promise<{
    artists: Array<SearchResultsArtist>;
    releases: Array<SearchResultsAlbum>;
    tracks: Array<SearchResultsTrack>;
  }> {
    return Discogs.search(query)
    .then(response => response.json())
    .then(json => json.map(result => ({
      ...result,
      source: SearchResultsSource.Discogs
    })));
  }

  async fetchArtistDetails(artistId: string): Promise<ArtistDetails> {
    const discogsInfo: DiscogsArtistInfo = await (await Discogs.artistInfo(artistId)).json();
    const lastfmInfo = await Promise.all([]);
  }

  fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails> {
    throw new Error("Method not implemented.");
  }

  fetchArtistAlbums(artistId: string): Promise<SearchResultsAlbum[]> {
    throw new Error("Method not implemented.");
  }

  fetchAlbumDetailsByName(albumName: string): Promise<AlbumDetails> {
    throw new Error("Method not implemented.");
  }
}

export default DiscogsMetaProvider;
