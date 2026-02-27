import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

import type { Playlist } from '@nuclearplayer/model';

import { usePlaylistStore } from '../../stores/playlistStore';

export const useSaveLocally = (playlist: Playlist | null) => {
  const navigate = useNavigate();
  const importPlaylist = usePlaylistStore((state) => state.importPlaylist);

  const saveLocally = useCallback(async () => {
    if (!playlist) {
      return;
    }

    const newId = await importPlaylist(playlist);
    navigate({
      to: '/playlists/$playlistId',
      params: { playlistId: newId },
    });
  }, [playlist, importPlaylist, navigate]);

  return { saveLocally };
};
