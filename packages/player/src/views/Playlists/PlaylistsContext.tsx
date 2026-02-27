import { useNavigate } from '@tanstack/react-router';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@nuclearplayer/i18n';
import type { PlaylistProvider } from '@nuclearplayer/plugin-sdk';

import { providersHost } from '../../services/providersHost';
import { usePlaylistStore } from '../../stores/playlistStore';

type CreatePlaylistContextValue = {
  isCreateDialogOpen: boolean;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  createPlaylist: (name: string) => Promise<void>;
};

type ImportFromUrlContextValue = {
  isUrlDialogOpen: boolean;
  openUrlDialog: () => void;
  closeUrlDialog: () => void;
  importFromUrl: (url: string) => Promise<void>;
};

const CreatePlaylistContext = createContext<CreatePlaylistContextValue | null>(
  null,
);

const ImportFromUrlContext = createContext<ImportFromUrlContextValue | null>(
  null,
);

export const useCreatePlaylistContext = () => {
  const ctx = useContext(CreatePlaylistContext);
  if (!ctx) {
    throw new Error(
      'useCreatePlaylistContext must be used within <PlaylistsProvider>',
    );
  }
  return ctx;
};

export const useImportFromUrlContext = () => {
  const ctx = useContext(ImportFromUrlContext);
  if (!ctx) {
    throw new Error(
      'useImportFromUrlContext must be used within <PlaylistsProvider>',
    );
  }
  return ctx;
};

const CreatePlaylistProvider: FC<PropsWithChildren> = ({ children }) => {
  const storeCreatePlaylist = usePlaylistStore((state) => state.createPlaylist);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const openCreateDialog = useCallback(() => setIsCreateDialogOpen(true), []);
  const closeCreateDialog = useCallback(() => setIsCreateDialogOpen(false), []);

  const createPlaylist = useCallback(
    async (name: string) => {
      await storeCreatePlaylist(name);
      setIsCreateDialogOpen(false);
    },
    [storeCreatePlaylist],
  );

  const value = useMemo(
    () => ({
      isCreateDialogOpen,
      openCreateDialog,
      closeCreateDialog,
      createPlaylist,
    }),
    [isCreateDialogOpen, openCreateDialog, closeCreateDialog, createPlaylist],
  );

  return (
    <CreatePlaylistContext.Provider value={value}>
      {children}
    </CreatePlaylistContext.Provider>
  );
};

const ImportFromUrlProvider: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation('playlists');
  const navigate = useNavigate();
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);

  const openUrlDialog = useCallback(() => setIsUrlDialogOpen(true), []);
  const closeUrlDialog = useCallback(() => setIsUrlDialogOpen(false), []);

  const importFromUrl = useCallback(
    async (url: string) => {
      const providers = providersHost.list('playlists') as PlaylistProvider[];
      const matchingProvider = providers.find((provider) =>
        provider.matchesUrl(url),
      );

      if (!matchingProvider) {
        toast.error(t('importUrlNoProvider'));
        return;
      }

      setIsUrlDialogOpen(false);
      navigate({
        to: '/playlists/import/$providerId',
        params: { providerId: matchingProvider.id },
        search: { url: encodeURIComponent(url) },
      });
    },
    [navigate, t],
  );

  const value = useMemo(
    () => ({
      isUrlDialogOpen,
      openUrlDialog,
      closeUrlDialog,
      importFromUrl,
    }),
    [isUrlDialogOpen, openUrlDialog, closeUrlDialog, importFromUrl],
  );

  return (
    <ImportFromUrlContext.Provider value={value}>
      {children}
    </ImportFromUrlContext.Provider>
  );
};

export const PlaylistsProvider: FC<PropsWithChildren> = ({ children }) => (
  <CreatePlaylistProvider>
    <ImportFromUrlProvider>{children}</ImportFromUrlProvider>
  </CreatePlaylistProvider>
);
