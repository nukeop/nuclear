import type {
  Album,
  AlbumRef,
  ArtistBio,
  ArtistRef,
  ArtistSocialStats,
  PlaylistRef,
  SearchCategory,
  SearchParams,
  SearchResults,
  Track,
  TrackRef,
} from '@nuclearplayer/model';

import type { ProviderDescriptor } from './providers';

export type SearchCapability = SearchCategory | 'unified';

export type ArtistMetadataCapability =
  | 'artistBio'
  | 'artistSocialStats'
  | 'artistTopTracks'
  | 'artistAlbums'
  | 'artistPlaylists'
  | 'artistRelatedArtists';

export type AlbumMetadataCapability = 'albumDetails';

export type MetadataProvider = ProviderDescriptor<'metadata'> & {
  searchCapabilities?: SearchCapability[];
  artistMetadataCapabilities?: ArtistMetadataCapability[];
  albumMetadataCapabilities?: AlbumMetadataCapability[];
  streamingProviderId?: string;
  search?: (params: SearchParams) => Promise<SearchResults>;
  searchArtists?: (params: Omit<SearchParams, 'types'>) => Promise<ArtistRef[]>;
  searchAlbums?: (params: Omit<SearchParams, 'types'>) => Promise<AlbumRef[]>;
  searchTracks?: (params: Omit<SearchParams, 'types'>) => Promise<Track[]>;
  searchPlaylists?: (
    params: Omit<SearchParams, 'types'>,
  ) => Promise<PlaylistRef[]>;

  fetchArtistBio?: (artistId: string) => Promise<ArtistBio>;
  fetchArtistSocialStats?: (artistId: string) => Promise<ArtistSocialStats>;
  fetchAlbumDetails?: (query: string) => Promise<Album>;
  fetchArtistTopTracks?: (artistId: string) => Promise<TrackRef[]>;
  fetchArtistAlbums?: (artistId: string) => Promise<AlbumRef[]>;
  fetchArtistPlaylists?: (artistId: string) => Promise<PlaylistRef[]>;
  fetchArtistRelatedArtists?: (artistId: string) => Promise<ArtistRef[]>;
};

export class MissingCapabilityError extends Error {
  constructor(capability: string, providerName: string) {
    super(
      `Missing capability: Provider "${providerName}" declared capability "${capability}" but does not implement it`,
    );
    this.name = 'MissingCapabilityError';
  }
}
