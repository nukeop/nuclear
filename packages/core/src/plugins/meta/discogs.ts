import _ from 'lodash';

import MetaProvider from '../metaProvider';
import * as Discogs from '../../rest/Discogs';
import LastFmApi from '../../rest/Lastfm';
import Track from '../../structs/Track';
import {
  SearchResultsArtist,
  SearchResultsAlbum,
  SearchResultsTrack,
  SearchResultsSource,
  ArtistDetails,
  AlbumDetails,
  AlbumType
} from '../plugins.types';
import {
  DiscogsReleaseSearchResponse,
  DiscogsArtistSearchResponse,
  DiscogsArtistInfo,
  DiscogsArtistSearchResult,
  DiscogsReleaseSearchResult,
  DiscogsArtistReleaseSearchResult,
  DiscogsReleaseInfo,
  DiscogsTrack
} from '../../rest/Discogs.types';
import { LastFmArtistInfo, LastfmTopTracks, LastfmTrack } from '../../rest/Lastfm.types';
import { cleanName } from '../../structs/Artist';
import SimilarArtistsService from './SimilarArtistsService';

class DiscogsMetaProvider extends MetaProvider {
  lastfm: LastFmApi;
  readonly similarArtistsService: SimilarArtistsService = new SimilarArtistsService();

  constructor() {
    super();
    this.name = 'Discogs Meta Provider';
    this.searchName = 'Discogs';
    this.sourceName = 'Discogs Metadata Provider';
    this.description = 'Metadata provider that uses Discogs as a source.';
    this.image = null;
    this.isDefault = false;
    this.lastfm = new LastFmApi(process.env.LAST_FM_API_KEY, process.env.LASTFM_API_SECRET);
  }

  getCoverImage(entity: DiscogsReleaseInfo | DiscogsArtistInfo) {
    return _.get(
      _.find(entity.images, { type: 'primary' }), 
      'resource_url',
      _.get(_.find(entity.images, { type: 'secondary' }), 'resource_url')
    );
  }

  discogsReleaseSearchResultToGeneric(release: DiscogsReleaseSearchResult): SearchResultsAlbum {
    const albumNameRegex = /(?<artist>.*) - (?<album>.*)/g;
    const match = albumNameRegex.exec(release.title);

    return {
      id: `${release.id}`,
      coverImage: release.cover_image,
      thumb: release.cover_image,
      title: match.groups.album,
      artist: match.groups.artist,
      resourceUrl: release.resource_url,
      source: SearchResultsSource.Discogs
    };
  }
  
  discogsArtistReleaseSearchResultToGeneric(release: DiscogsArtistReleaseSearchResult): SearchResultsAlbum {
    return {
      id: `${release.id}`,
      coverImage: release.thumb,
      thumb: release.thumb,
      title: release.title,
      artist: release.artist,
      resourceUrl: release.resource_url,
      type: release.type,
      source: SearchResultsSource.Discogs
    };
  }

  discogsReleaseInfoToGeneric(release: DiscogsReleaseInfo, releaseType: AlbumType): AlbumDetails {
    const artist = _.head(release.artists).name;
    const coverImage = this.getCoverImage(release);
    const tracklist: Track[] = [];

    release.tracklist.forEach(track => {
      if (track.sub_tracks) {
        track.sub_tracks.forEach(subTrack => tracklist.push(this.discogsTrackToGeneric(subTrack, artist)));
      } else {
        tracklist.push(this.discogsTrackToGeneric(track, artist));
      }
    });

    return {
      id: `${release.id}`,
      artist: _.head(release.artists).name,
      title: release.title,
      thumb: coverImage,
      coverImage,
      images: _.map(release.images, 'resource_url'),
      genres: [..._.map(release.genres), ..._.map(release.styles)],
      year: `${release.year}`,
      type: releaseType,
      tracklist,
      resourceUrl: release.resource_url
    };
  }

  discogsTrackToGeneric(discogsTrack: DiscogsTrack, artist: string): Track {
    const track = new Track();
    track.artist = artist;
    track.title = discogsTrack.title;
    track.duration = discogsTrack.duration;
    track.position = discogsTrack.position;
    track.extraArtists = _.map(discogsTrack.extraartists, 'name');
    track.type = discogsTrack.type_;
    return track;
  }

  discogsArtistSearchResultToGeneric(artist: DiscogsArtistSearchResult): SearchResultsArtist {
    return {
      id: `${artist.id}`,
      coverImage: artist.cover_image,
      thumb: artist.thumb,
      name: artist.title,
      resourceUrl: artist.resource_url,
      source: SearchResultsSource.Discogs
    };
  }

  searchForArtists(query: string): Promise<Array<SearchResultsArtist>> {
    return Discogs.search(query, 'artist')
      .then(response => response.json())
      .then((json: DiscogsArtistSearchResponse) => json.results.map(this.discogsArtistSearchResultToGeneric));
  }

  searchForReleases(query: string): Promise<Array<SearchResultsAlbum>> {
    return Discogs.search(query, 'master')
      .then(response => response.json())
      .then((json: DiscogsReleaseSearchResponse) => json.results.map(this.discogsReleaseSearchResultToGeneric));
  }

  searchForTracks(): Promise<Array<SearchResultsTrack>> {
    return Promise.resolve([]);
  }

  searchAll(query): Promise<{
    artists: Array<SearchResultsArtist>;
    releases: Array<SearchResultsAlbum>;
    tracks: Array<SearchResultsTrack>;
  }> {
    return Discogs.search(query)
      .then(response => response.json())
      .then(json => {
        if (json.results) {
          const artists = json.results.flatMap(item => 
            (item.type === 'artist') ?
              [this.discogsArtistSearchResultToGeneric(item)] : []
          );
      
          const releases = json.results.flatMap(item =>
            (item.type === 'master' || item.type === 'release' ) ?
              [this.discogsReleaseSearchResultToGeneric(item)] : []
          );
      
          return Promise.resolve({ artists, releases, tracks: [] });
        }
      
        return Promise.resolve({ artists: [], releases: [], tracks: [] });
      });
  }

  async fetchArtistDetails(artistId: string): Promise<ArtistDetails> {
    const discogsInfo: DiscogsArtistInfo = await (await Discogs.artistInfo(artistId)).json();
    discogsInfo.name = cleanName(discogsInfo.name);

    const lastFmInfo: LastFmArtistInfo = (await (await this.lastfm.getArtistInfo(discogsInfo.name)).json()).artist;
    const lastFmTopTracks: LastfmTopTracks = (await (await this.lastfm.getArtistTopTracks(discogsInfo.name)).json()).toptracks;
    const coverImage = this.getCoverImage(discogsInfo);
    const similarArtists = await this.similarArtistsService.createSimilarArtists(lastFmInfo);

    return {
      id: discogsInfo.id,
      name: discogsInfo.name,
      description: _.get(lastFmInfo, 'bio.summary'),
      tags: _.map(_.get(lastFmInfo, 'tags.tag'), 'name'),
      onTour: this.isArtistOnTour(lastFmInfo),
      coverImage,
      thumb: coverImage,
      images: _.map(discogsInfo.images, 'resource_url'),
      topTracks: _.map(lastFmTopTracks?.track, (track: LastfmTrack) => ({
        name: track.name,
        title: track.name,
        thumb: coverImage,
        playcount: track.playcount,
        listeners: track.listeners,
        artist: track.artist
      })),
      similar: similarArtists,
      source: SearchResultsSource.Discogs
    };
  }

  isArtistOnTour(artistInfo: LastFmArtistInfo | undefined): boolean {
    return artistInfo?.ontour === '1';
  }

  async fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails> {
    const artistSearch = await (await Discogs.search(artistName, 'artist')).json();
    const artist: DiscogsArtistSearchResult = _.head(artistSearch.results);
    return this.fetchArtistDetails(`${artist.id}`);
  }

  async fetchArtistAlbums(artistId: string): Promise<SearchResultsAlbum[]> {
    const releases = await (await Discogs.artistReleases(artistId));
    return releases.map(this.discogsArtistReleaseSearchResultToGeneric);
  }

  async fetchAlbumDetails(
    albumId: string,
    albumType: 'master' | 'release' = 'master',
    resourceUrl: string): Promise<AlbumDetails> {
    const albumData: DiscogsReleaseInfo = await (await Discogs.releaseInfo(
      albumId,
      albumType,
      { resource_url: resourceUrl }
    )).json();
    
    return Promise.resolve(
      this.discogsReleaseInfoToGeneric(
        albumData,
        albumType as AlbumType
      )
    );
  }

  async fetchAlbumDetailsByName(
    albumName: string,
    albumType: 'master' | 'release' = 'master',
    artist: string
  ): Promise<AlbumDetails> {
    const albumSearch: DiscogsReleaseSearchResponse = await (await Discogs.search(albumName, ['master', 'release'], {artist})).json();
    const matchingAlbum: DiscogsReleaseSearchResult = _.head(albumSearch.results);
    const albumData: DiscogsReleaseInfo = await (await Discogs.releaseInfo(
      `${matchingAlbum.id}`,
      albumType,
      { resource_url: matchingAlbum.resource_url }
    )).json();
    return this.discogsReleaseInfoToGeneric(
      albumData,
      albumType === 'master' ? AlbumType.master : AlbumType.release
    );
  }
}

export default DiscogsMetaProvider;
