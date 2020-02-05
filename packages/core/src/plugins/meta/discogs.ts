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
  DiscogsArtistInfo, DiscogsImage
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

  searchForArtists(query: string): Promise<Array<SearchResultsArtist>> {
    return Discogs.search(query, 'artist')
      .then(response => response.json())
      .then(json => json.map(artist => ({
        ...artist,
        source: SearchResultsSource.Discogs
      })));
  }

  searchForReleases(query: string): Promise<Array<SearchResultsAlbum>> {
    return Discogs.search(query, 'master')
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
    const discogsSearch = await (await Discogs.search(artistName, 'artist')).json();
    const artist = _.head(discogsSearch.results);
    return this.fetchArtistDetails(artist.id);
  }

  fetchArtistAlbums(artistId: string): Promise<SearchResultsAlbum[]> {
    throw new Error("Method not implemented.");
  }

  fetchAlbumDetailsByName(albumName: string): Promise<AlbumDetails> {
    throw new Error("Method not implemented.");
  }
}

export default DiscogsMetaProvider;
