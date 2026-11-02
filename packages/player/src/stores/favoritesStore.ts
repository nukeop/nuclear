import { LazyStore } from '@tauri-apps/plugin-store';
import { create } from 'zustand';

import type {
  AlbumRef,
  ArtistRef,
  ProviderRef,
  Track,
} from '@nuclearplayer/model';
import type { FavoriteEntry, FavoritesData } from '@nuclearplayer/plugin-sdk';

export type { FavoriteEntry, FavoritesData };

const FAVORITES_FILE = 'favorites.json';
const store = new LazyStore(FAVORITES_FILE);

type RefWithSource = { source: ProviderRef };

type FavoritesState = FavoritesData & {
  loaded: boolean;

  loadFromDisk: () => Promise<void>;

  addTrack: (track: Track) => Promise<void>;
  removeTrack: (source: ProviderRef) => Promise<void>;
  isTrackFavorite: (source: ProviderRef) => boolean;

  addAlbum: (ref: AlbumRef) => Promise<void>;
  removeAlbum: (source: ProviderRef) => Promise<void>;
  isAlbumFavorite: (source: ProviderRef) => boolean;

  addArtist: (ref: ArtistRef) => Promise<void>;
  removeArtist: (source: ProviderRef) => Promise<void>;
  isArtistFavorite: (source: ProviderRef) => boolean;
};

const sourceKey = (source: ProviderRef): string =>
  JSON.stringify([source.provider, source.id]);

const sourceKeysByList = new WeakMap<
  FavoriteEntry<RefWithSource>[],
  Set<string>
>();

const getSourceKeys = (list: FavoriteEntry<RefWithSource>[]): Set<string> => {
  const cached = sourceKeysByList.get(list);
  if (cached) {
    return cached;
  }
  const keys = new Set(list.map((entry) => sourceKey(entry.ref.source)));
  sourceKeysByList.set(list, keys);
  return keys;
};

const saveToDisk = async (): Promise<void> => {
  const state = useFavoritesStore.getState();
  await store.set('favorites.tracks', state.tracks);
  await store.set('favorites.albums', state.albums);
  await store.set('favorites.artists', state.artists);
  await store.save();
};

type FavoritesKey = 'tracks' | 'albums' | 'artists';

const getList = <T extends RefWithSource>(key: FavoritesKey) =>
  useFavoritesStore.getState()[key] as unknown as FavoriteEntry<T>[];

const createAddFavorite =
  <T extends RefWithSource>(key: FavoritesKey) =>
  async (ref: T): Promise<void> => {
    const list = getList<T>(key);
    if (getSourceKeys(list).has(sourceKey(ref.source))) {
      return;
    }
    const entry: FavoriteEntry<T> = {
      ref,
      addedAtIso: new Date().toISOString(),
    };
    useFavoritesStore.setState({ [key]: [...list, entry] });
    await saveToDisk();
  };

const createRemoveFavorite =
  <T extends RefWithSource>(key: FavoritesKey) =>
  async (source: ProviderRef): Promise<void> => {
    const keyToRemove = sourceKey(source);
    useFavoritesStore.setState({
      [key]: getList<T>(key).filter(
        (entry) => sourceKey(entry.ref.source) !== keyToRemove,
      ),
    });
    await saveToDisk();
  };

const createIsFavorite =
  <T extends RefWithSource>(key: FavoritesKey) =>
  (source: ProviderRef): boolean =>
    getSourceKeys(getList<T>(key)).has(sourceKey(source));

export const useFavoritesStore = create<FavoritesState>(() => ({
  tracks: [],
  albums: [],
  artists: [],
  loaded: false,

  loadFromDisk: async () => {
    const tracks =
      (await store.get<FavoriteEntry<Track>[]>('favorites.tracks')) ?? [];
    const albums =
      (await store.get<FavoriteEntry<AlbumRef>[]>('favorites.albums')) ?? [];
    const artists =
      (await store.get<FavoriteEntry<ArtistRef>[]>('favorites.artists')) ?? [];

    useFavoritesStore.setState({ tracks, albums, artists, loaded: true });
  },

  addTrack: createAddFavorite<Track>('tracks'),
  removeTrack: createRemoveFavorite<Track>('tracks'),
  isTrackFavorite: createIsFavorite<Track>('tracks'),

  addAlbum: createAddFavorite<AlbumRef>('albums'),
  removeAlbum: createRemoveFavorite<AlbumRef>('albums'),
  isAlbumFavorite: createIsFavorite<AlbumRef>('albums'),

  addArtist: createAddFavorite<ArtistRef>('artists'),
  removeArtist: createRemoveFavorite<ArtistRef>('artists'),
  isArtistFavorite: createIsFavorite<ArtistRef>('artists'),
}));

export const initializeFavoritesStore = async (): Promise<void> => {
  await useFavoritesStore.getState().loadFromDisk();
};
