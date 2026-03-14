import { MetadataProvider } from '@nuclearplayer/plugin-sdk';

import {
  ALBUMS_BEATLES,
  BIO_BEATLES,
  PLAYLISTS_DEADMAU5,
  RELATED_ARTISTS_BEATLES,
  RELATED_ARTISTS_DEADMAU5,
  SEARCH_RESULT,
  SOCIAL_STATS_DEADMAU5,
  TOP_TRACKS_BEATLES,
  TOP_TRACKS_DEADMAU5,
} from '../fixtures/artists';

export class MetadataProviderBuilder {
  private provider: MetadataProvider;

  static bioStyleProvider(): MetadataProviderBuilder {
    return new MetadataProviderBuilder()
      .withSearchCapabilities(['unified', 'artists'])
      .withArtistMetadataCapabilities([
        'artistBio',
        'artistAlbums',
        'artistTopTracks',
        'artistRelatedArtists',
      ])
      .withAlbumMetadataCapabilities(['albumDetails'])
      .withSearch(async () => SEARCH_RESULT)
      .withFetchArtistBio(async () => BIO_BEATLES)
      .withFetchArtistAlbums(async () => ALBUMS_BEATLES)
      .withFetchArtistTopTracks(async () => TOP_TRACKS_BEATLES)
      .withFetchArtistRelatedArtists(async () => RELATED_ARTISTS_BEATLES);
  }

  static socialStatsStyleProvider(): MetadataProviderBuilder {
    return new MetadataProviderBuilder()
      .withSearchCapabilities(['unified', 'artists'])
      .withArtistMetadataCapabilities([
        'artistSocialStats',
        'artistTopTracks',
        'artistPlaylists',
        'artistRelatedArtists',
      ])
      .withSearch(async () => SEARCH_RESULT)
      .withFetchArtistSocialStats(async () => SOCIAL_STATS_DEADMAU5)
      .withFetchArtistTopTracks(async () => TOP_TRACKS_DEADMAU5)
      .withFetchArtistPlaylists(async () => PLAYLISTS_DEADMAU5)
      .withFetchArtistRelatedArtists(async () => RELATED_ARTISTS_DEADMAU5);
  }

  constructor() {
    this.provider = {
      id: 'test-metadata-provider',
      kind: 'metadata',
      name: 'Test Metadata Provider',
    };
  }

  withId(id: MetadataProvider['id']): this {
    this.provider.id = id;
    return this;
  }

  withKind(kind: MetadataProvider['kind']): this {
    this.provider.kind = kind;
    return this;
  }

  withName(name: MetadataProvider['name']): this {
    this.provider.name = name;
    return this;
  }

  withStreamingProviderId(
    streamingProviderId: MetadataProvider['streamingProviderId'],
  ): this {
    this.provider.streamingProviderId = streamingProviderId;
    return this;
  }

  withSearchCapabilities(
    searchCapabilities: MetadataProvider['searchCapabilities'],
  ): this {
    this.provider.searchCapabilities = searchCapabilities;
    return this;
  }

  withArtistMetadataCapabilities(
    artistMetadataCapabilities: MetadataProvider['artistMetadataCapabilities'],
  ): this {
    this.provider.artistMetadataCapabilities = artistMetadataCapabilities;
    return this;
  }

  withAlbumMetadataCapabilities(
    albumMetadataCapabilities: MetadataProvider['albumMetadataCapabilities'],
  ): this {
    this.provider.albumMetadataCapabilities = albumMetadataCapabilities;
    return this;
  }

  withSearch(search: MetadataProvider['search']): this {
    this.provider.search = search;
    return this;
  }

  withSearchArtists(searchArtists: MetadataProvider['searchArtists']): this {
    this.provider.searchArtists = searchArtists;
    return this;
  }

  withSearchAlbums(searchAlbums: MetadataProvider['searchAlbums']): this {
    this.provider.searchAlbums = searchAlbums;
    return this;
  }

  withSearchTracks(searchTracks: MetadataProvider['searchTracks']): this {
    this.provider.searchTracks = searchTracks;
    return this;
  }

  withSearchPlaylists(
    searchPlaylists: MetadataProvider['searchPlaylists'],
  ): this {
    this.provider.searchPlaylists = searchPlaylists;
    return this;
  }

  withFetchArtistBio(fetchArtistBio: MetadataProvider['fetchArtistBio']): this {
    this.provider.fetchArtistBio = fetchArtistBio;
    return this;
  }

  withFetchArtistSocialStats(
    fetchArtistSocialStats: MetadataProvider['fetchArtistSocialStats'],
  ): this {
    this.provider.fetchArtistSocialStats = fetchArtistSocialStats;
    return this;
  }

  withFetchArtistAlbums(
    fetchArtistAlbums: MetadataProvider['fetchArtistAlbums'],
  ): this {
    this.provider.fetchArtistAlbums = fetchArtistAlbums;
    return this;
  }

  withFetchArtistTopTracks(
    fetchArtistTopTracks: MetadataProvider['fetchArtistTopTracks'],
  ): this {
    this.provider.fetchArtistTopTracks = fetchArtistTopTracks;
    return this;
  }

  withFetchArtistRelatedArtists(
    fetchArtistRelatedArtists: MetadataProvider['fetchArtistRelatedArtists'],
  ): this {
    this.provider.fetchArtistRelatedArtists = fetchArtistRelatedArtists;
    return this;
  }

  withFetchArtistPlaylists(
    fetchArtistPlaylists: MetadataProvider['fetchArtistPlaylists'],
  ): this {
    this.provider.fetchArtistPlaylists = fetchArtistPlaylists;
    return this;
  }

  withFetchAlbumDetails(
    fetchAlbumDetails: MetadataProvider['fetchAlbumDetails'],
  ): this {
    this.provider.fetchAlbumDetails = fetchAlbumDetails;
    return this;
  }

  build(): MetadataProvider {
    return this.provider;
  }
}
