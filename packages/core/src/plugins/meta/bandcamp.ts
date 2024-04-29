import _ from 'lodash';
import MetaProvider from '../metaProvider';
import {
  SearchResultsArtist,
  SearchResultsAlbum,
  SearchResultsTrack,
  ArtistDetails,
  AlbumDetails,
  AlbumType,
  SearchResultsSource
} from '../plugins.types';
import { Bandcamp, LastFmApi } from '../../rest';
import { Track } from '../..';
import { LastFmArtistInfo, LastfmTopTracks } from '../../rest/Lastfm.types';
import SimilarArtistsService from './SimilarArtistsService';

class BandcampMetaProvider extends MetaProvider {
  lastfm: LastFmApi;
  readonly similarArtistsService: SimilarArtistsService = new SimilarArtistsService();

  constructor() {
    super();
    this.name = 'Bandcamp Meta Provider';
    this.sourceName = 'Bandcamp Meta Provider';
    this.description = 'Metadata provider that uses Bandcamp as a source.';
    this.searchName = 'Bandcamp';
    this.image = null;
    this.lastfm = new LastFmApi(process.env.LAST_FM_API_KEY, process.env.LASTFM_API_SECRET);
  }

  searchForArtists(query: string): Promise<Array<SearchResultsArtist>> {
    return Bandcamp.search(query)
      .then(results => _(results).filter({ type: 'artist' }).map(artist => ({
        id: btoa(artist.url),
        coverImage: artist.imageUrl,
        thumb: artist.imageUrl,
        name: artist.name,
        resourceUrl: artist.url,
        source: SearchResultsSource.Bandcamp
      }))
        .value());
  }

  searchForReleases(query: string): Promise<Array<SearchResultsAlbum>> {
    return Bandcamp.search(query)
      .then(results => _(results).filter({ type: 'album' }).map(album => ({
        id: btoa(album.url),
        coverImage: album.imageUrl,
        thumb: album.imageUrl,
        title: album.name,
        artist: album.artist,
        resourceUrl: album.url,
        source: SearchResultsSource.Bandcamp
      }))
        .value());
  }

  async searchForTracks(query: string): Promise<SearchResultsTrack[]> {
    const results = await Bandcamp.search(query);
    return results
      .filter(result => result.type === 'track')
      .map(result => ({
        id: btoa(result.url),
        title: result.name,
        artist: result.artist,
        source: SearchResultsSource.Bandcamp
      }));
  }

  searchAll(): Promise<{
    artists: Array<SearchResultsArtist>;
    releases: Array<SearchResultsAlbum>;
    tracks: Array<SearchResultsTrack>;
  }> {
    throw new Error('Method not implemented.');
  }

  async fetchArtistAlbums(artistId: string): Promise<SearchResultsAlbum[]> {
    const artistInfo = await Bandcamp.getArtistInfo(atob(artistId));

    return artistInfo.albums.map(album => ({
      id: btoa(album.url),
      coverImage: album.coverImage,
      thumb: album.coverImage,
      title: album.title,
      artist: artistInfo.name,
      resourceUrl: album.url,
      type: 'master',
      source: SearchResultsSource.Bandcamp
    }));
  }

  async fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails> {
    const artists = await this.searchForArtists(artistName);
    return this.fetchArtistDetails(artists[0]?.id); 
  }

  async fetchAlbumDetailsByName(albumName: string): Promise<AlbumDetails> {
    const albums = await this.searchForReleases(albumName);
    return this.fetchAlbumDetails(albums[0]?.id, 'master', albums[0]?.resourceUrl);
  }

  async fetchArtistDetails(artistId: string): Promise<ArtistDetails> {
    const bandcampArtistDetails = await Bandcamp.getArtistInfo(atob(artistId));
    const lastFmInfo: LastFmArtistInfo = (await (await this.lastfm.getArtistInfo(bandcampArtistDetails.name)).json()).artist;
    const similarArtists = await this.similarArtistsService.createSimilarArtists(lastFmInfo);
    const lastFmTopTracks: LastfmTopTracks = (await (await this.lastfm.getArtistTopTracks(bandcampArtistDetails.name)).json()).toptracks;

    return ({
      id: artistId,
      name: bandcampArtistDetails.name,
      description: bandcampArtistDetails.description,
      coverImage: bandcampArtistDetails.coverImage,
      onTour: bandcampArtistDetails.shows.length > 0,
      similar: similarArtists,
      topTracks: _.map(lastFmTopTracks?.track, (track) => ({
        name: track.name,
        title: track.name,
        thumb: bandcampArtistDetails.coverImage,
        playcount: track.playcount,
        listeners: track.listeners,
        artist: track.artist
      })),
      source: SearchResultsSource.Bandcamp
    });
  }

  fetchAlbumDetails(
    albumId: string,
    albumType: 'master' | 'release',
    resourceUrl: string
  ): Promise<AlbumDetails> {
    return Bandcamp.getAlbumInfo(resourceUrl).then(album => ({
      id: albumId,
      artist: album.artist,
      title: album.title,
      thumb: album.imageUrl,
      coverImage: album.imageUrl,
      type: albumType as AlbumType,
      tracklist: album.tracks.map((track, index) => new Track({
        artist: album.artist,
        title: track.name,
        duration: track.duration,
        thumbnail: album.imageUrl,
        position: index + 1
      }))
    }));
  }
}

export default BandcampMetaProvider;
