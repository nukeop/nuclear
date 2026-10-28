import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@nuclearplayer/i18n';
import { PLAYLIST_EXPORT_VERSION } from '@nuclearplayer/model';

import { usePlaylistStore } from '../stores/playlistStore';
import { reportError } from '../utils/logging';

export const usePlaylistExport = (playlistId: string) => {
  const loadPlaylist = usePlaylistStore((state) => state.loadPlaylist);
  const { t } = useTranslation('playlists');

  const exportAsJson = useCallback(async () => {
    try {
      const playlist = await loadPlaylist(playlistId);
      if (!playlist) {
        return;
      }

      const filePath = await save({
        defaultPath: `${playlist.name}.json`,
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
      });

      if (!filePath) {
        return;
      }

      const exportData = { version: PLAYLIST_EXPORT_VERSION, playlist };
      await writeTextFile(filePath, JSON.stringify(exportData, null, 2));
      toast.success(t('exportSuccess'));
    } catch (error) {
      await reportError('playlists', {
        userMessage: t('exportError'),
        error,
      });
    }
  }, [loadPlaylist, playlistId, t]);

  return { exportAsJson };
};
