import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@nuclearplayer/i18n';

import { importPlaylistFromJson } from '../services/playlistImport';
import { usePlaylistStore } from '../stores/playlistStore';
import { reportError } from '../utils/logging';

export const usePlaylistImport = () => {
  const { t } = useTranslation('playlists');

  const importFromJson = useCallback(async () => {
    try {
      const filePath = await open({
        filters: [{ name: 'JSON', extensions: ['json'] }],
      });

      if (!filePath) {
        return;
      }

      const content = await readTextFile(filePath as string);
      const parsed = JSON.parse(content);
      const playlists = importPlaylistFromJson(parsed);

      if (playlists.length === 0) {
        toast.warning(t('importNoPlaylists'));
        return;
      }

      const store = usePlaylistStore.getState();
      for (const playlist of playlists) {
        await store.importPlaylist(playlist);
      }
      toast.success(
        playlists.length === 1
          ? t('importSuccess')
          : t('importBatchSuccess', { count: playlists.length }),
      );
    } catch (error) {
      await reportError('playlists', {
        userMessage: t('importError'),
        error,
      });
    }
  }, [t]);

  return { importFromJson };
};
