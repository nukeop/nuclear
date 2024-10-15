import _ from 'lodash';

import MetaProvider from '../metaProvider';
import * as Audius from '../../rest/Audius';
import LastFmApi from '../../rest/Lastfm';
import {
  SearchResultsArtist,
  SearchResultsAlbum,
  SearchResultsTrack,
  SearchResultsSource,
  ArtistDetails,
  AlbumDetails
} from '../plugins.types';
import { AudiusArtistSearchResponse, AudiusArtistInfo, AudiusArtistSearchResult } from '../../rest/Audius.types';
import { LastFmArtistInfo } from '../../rest/Lastfm.types';
import { cleanName } from '../../structs/Artist';
import SimilarArtistsService from './SimilarArtistsService';

class AudiusMetaProvider extends MetaProvider {
  lastfm: LastFmApi;
  readonly similarArtistsService: SimilarArtistsService = new SimilarArtistsService();

  constructor() {
    super();
    this.name = 'Audius Meta Provider';
    this.searchName = 'Audius';
    this.sourceName = 'Audius Metadata Provider';
    this.description = 'Metadata provider that uses Audius as a source.';
    this.image = null;
    this.lastfm = new LastFmApi(process.env.LAST_FM_API_KEY, process.env.LASTFM_API_SECRET);
    this.init();
  }

  async init(){
    this.apiEndpoint = await Audius._findHost();
  }

  searchForArtists(query: string): Promise<Array<SearchResultsArtist>> {
    return Audius.artistSearch(this.apiEndpoint, query)
      .then(response => response.json())
      .then((json: AudiusArtistSearchResponse) => json.data.map(artist => ({
        id: `${artist.id}`,
        coverImage: artist.cover_photo ? artist.cover_photo['600x'] : '',
        thumb: artist.profile_picture ? artist.profile_picture['480x480'] : '',
        name: artist.name,
        resourceUrl: `${this.apiEndpoint}/resolve?url=https://audius.co/${artist.handle}`,
        source: SearchResultsSource.Audius
      })));
  }

  async searchForReleases(query: string): Promise<Array<SearchResultsAlbum>> {
    await this.searchForTracks(query);
    return Promise.resolve([]);
  }

  searchForTracks(query: string): Promise<Array<SearchResultsTrack>> {
    return Audius.trackSearch(this.apiEndpoint, query)
      .then(response => response.json())
      .then((json) => json.data.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.user.name,
        source: SearchResultsSource.Audius
      })));
  }

  async searchAll(query): Promise<{
    artists: Array<SearchResultsArtist>;
    releases: Array<SearchResultsAlbum>;
    tracks: Array<SearchResultsTrack>;
  }> {
    const artists = await this.searchForArtists(query);
    const tracks = await this.searchForTracks(query);
    return Promise.resolve({ artists, releases: [], tracks });
  }

  async fetchArtistDetails(artistId: string): Promise<ArtistDetails> {
    const AudiusInfo: AudiusArtistInfo = (await ((await Audius.getArtist(this.apiEndpoint, artistId)).json())).data;
    AudiusInfo.name = cleanName(AudiusInfo.name);

    const lastFmInfo: LastFmArtistInfo = (await (await this.lastfm.getArtistInfo(AudiusInfo.name)).json()).artist;
    const hasLastFmArtist = typeof(lastFmInfo) !== 'undefined';
    const similarArtists = await this.similarArtistsService.createSimilarArtists(lastFmInfo);
    const ArtistTracks = (await ((await Audius.getArtistTracks(this.apiEndpoint, artistId)).json())).data;

    const coverImage = AudiusInfo.cover_photo ? AudiusInfo.cover_photo['640x'] : '';
    const thumb = AudiusInfo.profile_picture ? AudiusInfo.profile_picture['480x480'] : '';

    return Promise.resolve({
      id: AudiusInfo.id,
      name: AudiusInfo.name,
      description: AudiusInfo.bio,
      tags: hasLastFmArtist ? _.map(_.get(lastFmInfo, 'tags.tag'), 'name') : [],
      onTour: hasLastFmArtist ? lastFmInfo.ontour === '1' : false,
      coverImage,
      thumb,
      images: [coverImage, thumb],
      topTracks: _.map(ArtistTracks, (track) => ({
        name: track.title,
        title: track.title,
        thumb: track.artwork ? track.artwork['480x480'] : '',
        playcount: 0,
        listeners: track.listeners,
        artist: { name: AudiusInfo.name }
      })),
      similar: similarArtists,
      source: SearchResultsSource.Audius
    });
  }

  async fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails> {
    const artistSearch = (await (await Audius.artistSearch(this.apiEndpoint, artistName)).json());
    const artist: AudiusArtistSearchResult = _.head(artistSearch.data);
    return this.fetchArtistDetails(`${artist.id}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fetchArtistAlbums(artistId: string): Promise<SearchResultsAlbum[]> {
    // audius doesn't support album feature
    // await Audius.getArtist(this.apiEndpoint, artistId);
    return Promise.resolve([]);
  }

  async fetchAlbumDetails(): Promise<AlbumDetails> {
    throw new Error('Method not implemented.');
  }

  async fetchAlbumDetailsByName(): Promise<AlbumDetails> {
    throw new Error('Method not implemented.');
  }
}

export default AudiusMetaProvider;
