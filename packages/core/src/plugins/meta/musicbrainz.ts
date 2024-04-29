import _ from 'lodash';

import MetaProvider from '../metaProvider';
import {
  artistSearch,
  releaseSearch,
  trackSearch,
  getCoverForReleaseGroup,
  getCoverForRelease,
  getArtist,
  getArtistReleases,
  getReleaseGroupDetails,
  getReleaseDetails
} from '../../rest/Musicbrainz';
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
import { LastFmArtistInfo, LastfmTopTracks, LastfmTrack } from '../../rest/Lastfm.types';
import { MusicbrainzArtist, MusicbrainzReleaseGroup } from '../../rest/Musicbrainz.types';
import SimilarArtistsService from './SimilarArtistsService';

class MusicbrainzMetaProvider extends MetaProvider {
  lastfm: LastFmApi;
  readonly similarArtistsService: SimilarArtistsService = new SimilarArtistsService();

  constructor() {
    super();
    this.name = 'Musicbrainz Meta Provider';
    this.sourceName = 'Musicbrainz Meta Provider';
    this.description = 'Metadata provider that uses Musicbrainz as a source.';
    this.searchName = 'Musicbrainz';
    this.image = null;
    this.lastfm = new LastFmApi(process.env.LAST_FM_API_KEY, process.env.LASTFM_API_SECRET);
  }

  async releaseGroupToSearchResult(group: MusicbrainzReleaseGroup): Promise<SearchResultsAlbum> {
    const cover = await getCoverForReleaseGroup(group.id);
    return {
      id: group.id,
      coverImage: cover.ok ? cover.url : null,
      thumb: cover.ok ? cover.url : null,
      title: group.title,
      artist: _.get(group, 'artist-credit[0].name'),
      source: SearchResultsSource.Musicbrainz
    };
  }
  
  searchForArtists(query: string): Promise<Array<SearchResultsArtist>> {
    return artistSearch(query)
      .then(response => response.artists.map(artist => ({
        id: artist.id,
        coverImage: '',
        thumb: '',
        name: artist.name,
        source: SearchResultsSource.Musicbrainz
      })));
  }
  
  async searchForReleases(query: string): Promise<Array<SearchResultsAlbum>> {
    const releaseGroups = await releaseSearch(query)
      .then(response => response['release-groups']);

    return Promise.all(releaseGroups.map(this.releaseGroupToSearchResult));
  }
    
  searchForTracks(query: string): Promise<Array<SearchResultsTrack>> {
    return trackSearch(query)
      .then(response => response.tracks.map(track => ({
        id: track.id,
        title: '',
        artist: '',
        source: SearchResultsSource.Musicbrainz
      })));
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
    const mbArtist: MusicbrainzArtist = await getArtist(artistId);
    const lastFmInfo: LastFmArtistInfo = (await (await this.lastfm.getArtistInfo(mbArtist.name)).json()).artist;
    const similarArtists = await this.similarArtistsService.createSimilarArtists(lastFmInfo);
    const lastFmTopTracks: LastfmTopTracks = (await (await this.lastfm.getArtistTopTracks(mbArtist.name)).json()).toptracks;
      
    return Promise.resolve({
      id: artistId,
      name: mbArtist.name,
      description: lastFmInfo.bio.summary,
      tags: _.map(lastFmInfo.tags.tag, 'name'),
      onTour: lastFmInfo.ontour === '1',
      topTracks: _.map(lastFmTopTracks.track, (track: LastfmTrack) => ({
        artist: { name: track.artist.name },
        title: track.name,
        playcount: track.playcount,
        listeners: track.listeners
      })),
      similar: similarArtists,
      source: SearchResultsSource.Musicbrainz
    });
  }

  async fetchArtistDetailsByName(): Promise<ArtistDetails> {
    throw new Error('Method not implemented.');
  }

  async fetchArtistAlbums(artistId: string): Promise<SearchResultsAlbum[]> {
    const artist = await getArtistReleases(artistId);

    return Promise.all(artist['release-groups'].map(this.releaseGroupToSearchResult));
  }

  async fetchAlbumDetails(albumId: string): Promise<AlbumDetails> {
    const releaseGroupDetails = await getReleaseGroupDetails(albumId);
    const headRelease = _.head(releaseGroupDetails.releases);
    const releaseDetails = await getReleaseDetails(headRelease.id);
    const cover = await getCoverForRelease(releaseDetails.id);
    const artistName = _.get(releaseDetails, 'artist-credit[0].name');

    return Promise.resolve({
      id: releaseDetails.id, 
      artist: artistName,
      title: releaseDetails.title,
      thumb: cover.url,
      coverImage: cover.url,
      year: releaseDetails.date,
      genres: _.map(releaseDetails.genres, 'name'),
      type: AlbumType.release,
      tracklist: _.flatMap(releaseDetails.media, medium => _.map(medium.tracks, track => {
        const newtrack = new Track();
        newtrack.ids[SearchResultsSource.Musicbrainz] = track.id;
        newtrack.artist = artistName;
        newtrack.title = track.title;
        newtrack.duration = Math.ceil(track.length/1000);
        newtrack.position = track.position;
        newtrack.thumbnail = cover.url;
        return newtrack;
      }))
    });
  }

  fetchAlbumDetailsByName(): Promise<AlbumDetails> {
    throw new Error('Method not implemented.');
  }
}
  
  
export default MusicbrainzMetaProvider;
