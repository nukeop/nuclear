import _ from 'lodash';

import MetaProvider from '../metaProvider';
import * as iTunes from '../../rest/iTunes';
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
import { LastFmArtistInfo, LastfmTopTracks } from '../../rest/Lastfm.types';
import SimilarArtistsService from './SimilarArtistsService';

class iTunesMusicMetaProvider extends MetaProvider {
  lastfm: LastFmApi;
  readonly similarArtistsService: SimilarArtistsService = new SimilarArtistsService();

  constructor() {
    super();
    this.name = 'iTunesMusic Meta Provider';
    this.sourceName = 'iTunesMusic Meta Provider';
    this.description = 'Metadata provider that uses iTunes as a source.';
    this.searchName = 'iTunesMusic';
    this.image = null;
    this.lastfm = new LastFmApi(process.env.LAST_FM_API_KEY, process.env.LASTFM_API_SECRET);
  }

  async searchForArtists(query: string): Promise<SearchResultsArtist[]> {
    const artistInfo = (await ((await iTunes.artistSearch(query, '50')).json()));
    return artistInfo.results
      .filter(artist => artist.artistType === 'Artist')
      .map(artist => ({
        id: artist.artistId,
        coverImage: '',
        thumb: '',
        name: artist.artistName,
        resourceUrl: artist.artistLinkUrl,
        source: SearchResultsSource.iTunesMusic
      }));
  }

  async searchForReleases(query: string): Promise<SearchResultsAlbum[]> {
    const albumInfo = (await ((await iTunes.albumSearch(query, '50')).json()));
    return albumInfo.results.map(album => ({
      id: album.collectionId,
      coverImage: album.artworkUrl100.replace('100x100bb.jpg', '250x250bb.jpg'),
      thumb: album.artworkUrl100.replace('100x100bb.jpg', '1600x1600bb.jpg'),
      title: album.collectionName,
      artist: album.artistName,
      resourceUrl: album.artistViewUrl,
      source: SearchResultsSource.iTunesMusic
    }));
  }

  async searchForTracks(query: string): Promise<SearchResultsTrack[]> {
    const musicInfo = (await ((await iTunes.musicSearch(query, '50')).json()));
    return musicInfo.results.map(music => ({
      id: music.trackId,
      title: music.trackName,
      artist: music.artistName,
      source: SearchResultsSource.iTunesMusic
    }));
  }

  async searchAll(query): Promise<{
    artists: Array<SearchResultsArtist>;
    releases: Array<SearchResultsAlbum>;
    tracks: Array<SearchResultsTrack>;
  }> {
    const artists = await this.searchForArtists(query);
    const releases = await this.searchForReleases(query);
    const tracks = await this.searchForTracks(query);
    return Promise.resolve({ artists, releases, tracks });
  }

  async fetchArtistDetails(artistId: string): Promise<ArtistDetails> {
    const artistDetails = (await ((await iTunes.artistDetailsSearch(artistId, '1')).json()));
    const lastFmInfo: LastFmArtistInfo = 
      (await (await this.lastfm.getArtistInfo(artistDetails.results[0].artistName)).json()).artist;
    const similarArtists = await this.similarArtistsService.createSimilarArtists(lastFmInfo);
    const lastFmTopTracks: LastfmTopTracks =
      (await (await this.lastfm.getArtistTopTracks(artistDetails.results[0].artistName)).json()).toptracks;

    return ({
      id: artistId,
      name: artistDetails.results[0].artistName,
      coverImage: artistDetails.results[1].artworkUrl100.replace('100x100bb.jpg', '1600x1600bb.jpg'),
      similar: similarArtists,
      topTracks: _.map(lastFmTopTracks.track, (track) => ({
        name: track.name,
        title: track.name,
        thumb: artistDetails.results[1].artworkUrl100.replace('100x100bb.jpg', '250x250bb.jpg'),
        playcount: track.playcount,
        listeners: track.listeners,
        artist: track.artist
      })),
      source: SearchResultsSource.iTunesMusic
    });
  }

  async fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails> {
    const artists = await this.searchForArtists(artistName);
    return this.fetchArtistDetails(artists[0]?.id); 
  }

  async fetchArtistAlbums(artistId: string): Promise<SearchResultsAlbum[]> {
    const artistAlbums = (await ((await iTunes.artistAlbumsSearch(artistId)).json()));
    return artistAlbums.results.slice(1).map(album => ({
      id: album.collectionId,
      coverImage: album.artworkUrl100.replace('100x100bb.jpg', '250x250bb.jpg'),
      thumb: album.artworkUrl100.replace('100x100bb.jpg', '1600x1600bb.jpg'),
      title: album.collectionName,
      artist: album.artistName,
      resourceUrl: album.artistViewUrl,
      source: SearchResultsSource.iTunesMusic
    }));
  }

  async fetchAlbumDetails(
    albumId: string,
    albumType: 'master' | 'release'
  ): Promise<AlbumDetails> {
    const albumInfo = (await ((await iTunes.albumSongsSearch(albumId, '50')).json())).results;
    return Promise.resolve({
      id: albumInfo[0].collectionId,
      artist: albumInfo[0].artistName,
      title: albumInfo[0].collectionName,
      thumb: albumInfo[0].artworkUrl100.replace('100x100bb.jpg', '1600x1600bb.jpg'),
      coverImage: albumInfo[0].artworkUrl100.replace('100x100bb.jpg', '250x250bb.jpg'),
      year: albumInfo[0].releaseDate,
      type: albumType as AlbumType,
      tracklist: _.map(albumInfo.slice(1), (episode, index) => new Track ({
        artist: episode.collectionName,
        title: episode.trackName,
        duration: Math.ceil(episode.trackTimeMillis/1000),
        thumbnail: episode.artworkUrl60,
        position: index + 1
      }))
    });    
  }

  async fetchAlbumDetailsByName(albumName: string): Promise<AlbumDetails> {
    const albums = await this.searchForReleases(albumName);
    return this.fetchAlbumDetails(albums[0]?.id, 'master');
  }

}
export default iTunesMusicMetaProvider;
