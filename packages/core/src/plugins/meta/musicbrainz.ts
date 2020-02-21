import _ from 'lodash';

import MetaProvider from '../metaProvider';
import {
  artistSearch,
  releaseSearch,
  trackSearch,
  getCoverForRelease,
  getArtist
} from '../../rest/Musicbrainz';
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
  LastFmArtistInfo,
  LastfmTopTracks,
  LastfmTrack
} from '../../rest/Lastfm.types';
import {
  MusicbrainzArtist
} from '../../rest/Musicbrainz.types';


class MusicbrainzMetaProvider extends MetaProvider {
  lastfm: LastFmApi;
  constructor() {
    super();
    this.name = 'Musicbrainz Meta Provider';
    this.sourceName = 'Musicbrainz Meta Provider';
    this.description = 'Metadata provider that uses Musicbrainz as a source.';
    this.searchName = 'Musicbrainz';
    this.image = null;
    this.lastfm = new LastFmApi(process.env.LAST_FM_API_KEY, process.env.LASTFM_API_SECRET);
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
  
  async searchForReleases(query): Promise<Array<SearchResultsAlbum>> {
    const releaseGroups = await releaseSearch(query)
    .then(response => response['release-groups']);
    
    return Promise.all(releaseGroups.map(
      async group => {
        const cover = await getCoverForRelease(group.id);
        
        return {
          id: group.id,
          coverImage: cover.ok ? cover.url : null,
          thumb: cover.ok ? cover.url : null,
          title: group.title,
          artist: group.artist,
          source: SearchResultsSource.Musicbrainz
        };
      }
      ));
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
      const lastfmInfo: LastFmArtistInfo = await (await this.lastfm.getArtistInfo(mbArtist.name)).json();
      const lastFmTopTracks: LastfmTopTracks = await (await this.lastfm.getArtistTopTracks(mbArtist.name)).json();
      
      return Promise.resolve({
        id: artistId,
        name: mbArtist.name,
        description: lastfmInfo.bio.summary,
        tags: _.map(lastfmInfo.tags, 'name'),
        onTour: lastfmInfo.ontour === '1',
        topTracks: _.map(lastFmTopTracks.track, (track: LastfmTrack) => ({
          name: track.name,
          title: track.name,
          playcount: track.playcount,
          listeners: track.listeners
        })),
        source: SearchResultsSource.Musicbrainz
      });
    }
    fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails> {
      throw new Error('Method not implemented.');
    }
    fetchArtistAlbums(artistId: string): Promise<SearchResultsAlbum[]> {
      throw new Error('Method not implemented.');
    }
    fetchAlbumDetails(albumId: string, resourceUrl: string): Promise<AlbumDetails> {
      throw new Error("Method not implemented.");
    }
    fetchAlbumDetailsByName(albumName: string): Promise<AlbumDetails> {
      throw new Error('Method not implemented.');
    }
  }
  
  
  export default MusicbrainzMetaProvider;
  