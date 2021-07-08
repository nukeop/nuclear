import _ from 'lodash';

import MetaProvider from '../metaProvider';
import * as iTunes from '../../rest/iTunes';
import { 
  SearchResultsArtist, 
  SearchResultsAlbum, 
  SearchResultsTrack, 
  SearchResultsPodcast,
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

  async searchForReleases(): Promise<SearchResultsAlbum[]> {
    return Promise.resolve([]);
  }

  async searchForPodcast(query: string): Promise<SearchResultsPodcast[]> {
    const podcastInfo = (await ((await iTunes.podcastSearch(query, '50')).json()));
    return podcastInfo.results.map(podcast => ({
      id: podcast.collectionId,
      coverImage: podcast.artworkUrl600,
      thumb: podcast.artworkUrl600,
      title: podcast.collectionName,
      author: podcast.artistName,
      type: 'podcast',
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

  searchForArtists(): Promise<Array<SearchResultsArtist>> {
    return Promise.resolve([]);
  }

  searchForTracks(): Promise<SearchResultsTrack[]> {
    throw new Error('Method not implemented.');
  }

  searchAll(): Promise<{artists: SearchResultsArtist[]; releases: SearchResultsAlbum[]; tracks: SearchResultsTrack[];}> {
    throw new Error('Method not implemented.');
  }

  fetchArtistDetails(): Promise<ArtistDetails> {
    throw new Error('Method not implemented.');
  }

  fetchArtistDetailsByName(): Promise<ArtistDetails> {
    throw new Error('Method not implemented.');
  }

  fetchArtistAlbums(): Promise<SearchResultsAlbum[]> {
    throw new Error('Method not implemented.');
  }

  fetchAlbumDetailsByName(): Promise<AlbumDetails> {
    throw new Error('Method not implemented.');
  }
}

export default iTunesPodcastMetaProvider;
