import _ from 'lodash';

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
  DiscogsReleaseSearchResponse,
  DiscogsArtistSearchResponse,
  DiscogsArtistInfo,
  DiscogsImage,
  DiscogsReleaseSearchResult,
  DiscogsReleaseInfo
} from '../../rest/Discogs.types';
import { LastFmArtistInfo, LastfmTopTracks, LastfmTrack } from '../../rest/Lastfm.types';

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

  searchForArtists(query: string): Promise<Array<SearchResultsArtist>> {
    return Discogs.search(query, 'artist')
      .then(response => response.json())
      .then((json: DiscogsArtistSearchResponse) => json.results.map(artist => ({
        id: `${artist.id}`,
        coverImage: artist.cover_image,
        thumb: artist.thumb,
        name: artist.title,
        resourceUrl: artist.resource_url,
        source: SearchResultsSource.Discogs
      })));
  }

  searchForReleases(query: string): Promise<Array<SearchResultsAlbum>> {
    return Discogs.search(query, 'master')
      .then(response => response.json())
      .then((json: DiscogsReleaseSearchResponse) => json.results.map(this.discogsReleaseSearchResultToGeneric));
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

    const lastfmInfo: LastFmArtistInfo = await (await this.lastfm.getArtistInfo(discogsInfo.name)).json();
    const lastFmTopTracks: LastfmTopTracks = await (await this.lastfm.getArtistTopTracks(discogsInfo.name)).json();

    return Promise.resolve({
      id: discogsInfo.id,
      name: discogsInfo.name,
      description: lastfmInfo.bio.summary,
      tags: _.map(lastfmInfo.tags, 'name'),
      onTour: lastfmInfo.ontour === '1',
      coverImage: (_.head(discogsInfo.images) as DiscogsImage).resource_url,
      thumb: (_.get(discogsInfo.images, 1) as DiscogsImage).resource_url,
      images: _.map(discogsInfo.images, 'resource_url'),
      topTracks: _.map(lastFmTopTracks.track, (track: LastfmTrack) => ({
        name: track.name,
        title: track.name,
        thumb: (_.get(discogsInfo.images, 1) as DiscogsImage).resource_url,
        playcount: track.playcount,
        listeners: track.listeners
      })),
      source: SearchResultsSource.Discogs
    });
  }

  async fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails> {
    const artistSearch = await (await Discogs.search(artistName, 'artist')).json();
    const artist = _.head(artistSearch.results);
    return this.fetchArtistDetails(artist.id);
  }

  async fetchArtistAlbums(artistId: string): Promise<SearchResultsAlbum[]> {
    const releases: DiscogsReleaseSearchResponse = await (await Discogs.artistReleases(artistId)).json();

    return Promise.resolve(releases.results.map(this.discogsReleaseSearchResultToGeneric));
  }

  async fetchAlbumDetailsByName(
    albumName: string,
    albumType: 'master' | 'release' = 'master'
  ): Promise<AlbumDetails> {
    const albumSearch: DiscogsReleaseSearchResponse = await (await Discogs.search(albumName, albumType)).json();
    const matchingAlbum: DiscogsReleaseSearchResult = _.head(albumSearch.results);
    const albumData: DiscogsReleaseInfo = await (await Discogs.releaseInfo(
      `${matchingAlbum.id}`,
      albumType,
      { resource_url: matchingAlbum.resource_url }
    )).json();
    return Promise.resolve({
      ...albumData,
      id: `${albumData.id}`,
      artist: _.head(albumData.artists).name,
      images: _.map(albumData.images, 'resource_url'),
      year: `${albumData.year}`,
      source: SearchResultsSource.Discogs
    });
  }
}

export default DiscogsMetaProvider;
