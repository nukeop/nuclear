import _ from 'lodash';

import MetaProvider from '../metaProvider';
import * as iTunes from '../../rest/iTunesPodcast';
import { 
  SearchResultsArtist, 
  SearchResultsAlbum, 
  SearchResultsTrack, 
  ArtistDetails, 
  AlbumDetails,
  SearchResultsSource, 
  AlbumType
} from '../plugins.types';
import LastFmApi from '../../rest/Lastfm';
import Track from '../../structs/Track';

class iTunesPodcastMetaProvider extends MetaProvider {
  lastfm: LastFmApi;
  constructor() {
    super();
    this.name = 'iTunesPodcast Meta Provider';
    this.sourceName = 'iTunesPodcast Meta Provider';
    this.description = 'Metadata provider that uses iTunes as a source.';
    this.searchName = 'iTunesPodcast';
    this.image = null;
    this.lastfm = new LastFmApi(process.env.LAST_FM_API_KEY, process.env.LASTFM_API_SECRET);
  }

  searchForArtists(query: string): Promise<Array<SearchResultsArtist>> {
    return iTunes.podcastSearch(query, '50')
      .then(response => response.json())
      .then(response => response.results.map(podcast => ({
        id: `${podcast.collectionId}`,
        coverImage: podcast.artworkUrl600,
        thumb: podcast.artworkUrl600,
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

  async fetchArtistDetails(): Promise<ArtistDetails> {
    throw new Error('Method not implemented.');
  }

  async fetchArtistDetailsByName(): Promise<ArtistDetails> {
    throw new Error('Method not implemented.');
  }

  async fetchArtistAlbums(podcastId: string): Promise<SearchResultsAlbum[]> {
    const podcastInfo = (await ((await iTunes.getPodcast(podcastId)).json()));
    return podcastInfo.results.map(podcast => ({
      id: podcast.collectionId,
      coverImage: podcast.artworkUrl600,
      thumb: podcast.artworkUrl600,
      title: podcast.collectionName,
      artist: podcast.artistName,
      type: 'master',
      source: SearchResultsSource.iTunesPodcast
    }));
  }

  async fetchAlbumDetails(podcastId: string): Promise<AlbumDetails> {
    const podcastInfo = (await ((await iTunes.getPodcastEpisodes(podcastId, '50')).json())).results;

    return Promise.resolve({
      id: podcastInfo[0].collectionId,
      artist: podcastInfo[0].collectionName,
      title: podcastInfo[0].collectionName,
      thumb: podcastInfo[0].artworkUrl600,
      coverImage: podcastInfo[0].artworkUrl600,
      year: podcastInfo[0].releaseDate,
      type: AlbumType.master,
      tracklist: _.map(podcastInfo.slice(1), (episode, index) => new Track ({
        artist: episode.collectionName,
        title: episode.trackName,
        duration: Math.ceil(episode.trackTimeMillis/1000),
        thumbnail: episode.artworkUrl60,
        position: index + 1
      }))
    });    
  }

  fetchAlbumDetailsByName(): Promise<AlbumDetails> {
    throw new Error('Method not implemented.');
  }
}

export default iTunesPodcastMetaProvider;
