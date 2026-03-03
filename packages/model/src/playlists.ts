import type { ArtworkSet, ProviderRef, Track } from './index';

export type Playlist = {
  id: string;
  name: string;
  description?: string;
  artwork?: ArtworkSet;
  tags?: string[];
  createdAtIso: string;
  lastModifiedIso: string;
  origin?: ProviderRef;
  isReadOnly: boolean;
  parentId?: string;
  items: PlaylistItem[];
};

export type PlaylistIndexEntry = Pick<
  Playlist,
  'id' | 'name' | 'createdAtIso' | 'lastModifiedIso' | 'isReadOnly' | 'artwork'
> & {
  itemCount: number;
  totalDurationMs: number;
  thumbnails: string[];
};

export type PlaylistItem<T extends Track = Track> = {
  id: string;
  track: T;
  note?: string;
  addedAtIso: string;
};
