import type { LocalFileInfo, StreamCandidate } from './streaming';

export type ProviderRef = {
  provider: string;
  id: string;
  url?: string;
};

export type ArtistCredit = {
  name: string;
  roles: string[];
  source?: ProviderRef;
};

export const formatArtistNames = (artists: ArtistCredit[]): string =>
  artists.map((artist) => artist.name).join(', ');

export type ArtworkPurpose = 'avatar' | 'cover' | 'background' | 'thumbnail';

export type Artwork = {
  url: string;
  width?: number;
  height?: number;
  purpose?: ArtworkPurpose;
  source?: ProviderRef;
};

export type ArtworkSet = {
  items: Artwork[];
};

export type ArtistRef = {
  name: string;
  disambiguation?: string;
  artwork?: ArtworkSet;
  source: ProviderRef;
};

export type AlbumRef = {
  title: string;
  artists?: ArtistRef[];
  artwork?: ArtworkSet;
  source: ProviderRef;
};

export type TrackRef = {
  title: string;
  artists: ArtistRef[];
  artwork?: ArtworkSet;
  source: ProviderRef;
};

export type PlaylistRef = {
  id: string;
  name: string;
  artwork?: ArtworkSet;
  source: ProviderRef;
};

export type Track = {
  title: string;
  artists: ArtistCredit[];
  album?: AlbumRef;
  durationMs?: number;
  trackNumber?: number;
  disc?: string;
  artwork?: ArtworkSet;
  tags?: string[];
  source: ProviderRef;
  localFile?: LocalFileInfo;
  streamCandidates?: StreamCandidate[];
};

export type Album = {
  title: string;
  artists: ArtistCredit[];
  tracks?: TrackRef[];
  releaseDate?: {
    precision: 'year' | 'month' | 'day';
    dateIso: string;
  };
  genres?: string[];
  artwork?: ArtworkSet;
  source: ProviderRef;
};

export type ArtistBio = {
  name: string;
  disambiguation?: string;
  bio?: string;
  onTour?: boolean;
  artwork?: ArtworkSet;
  tags?: string[];
  source: ProviderRef;
};

export type ArtistSocialStats = {
  name: string;
  artwork?: ArtworkSet;
  city?: string;
  country?: string;
  followersCount?: number;
  followingsCount?: number;
  trackCount?: number;
  playlistCount?: number;
  source: ProviderRef;
};

export { pickArtwork } from './artwork';
export type { Playlist, PlaylistIndexEntry, PlaylistItem } from './playlists';
export type { QueueItem, RepeatMode, Queue } from './queue';
export type { SearchCategory, SearchParams, SearchResults } from './search';
export type { LocalFileInfo, Stream, StreamCandidate } from './streaming';
export {
  PLAYLIST_EXPORT_VERSION,
  playlistSchema,
  playlistExportSchema,
  playlistIndexEntrySchema,
  playlistIndexSchema,
  legacyTrackSchema,
  legacyPlaylistSchema,
  legacyConfigSchema,
} from './schemas';
export type { LegacyTrack, LegacyPlaylist } from './schemas';
