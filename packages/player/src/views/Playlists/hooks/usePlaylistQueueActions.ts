import { useTranslation } from '@nuclearplayer/i18n';

import { useFetchedTracksActions } from '../../../hooks/useFetchedTracksActions';
import { usePlaylistStore } from '../../../stores/playlistStore';

export const usePlaylistQueueActions = (playlistId: string) => {
  const { t } = useTranslation();
  const loadPlaylist = usePlaylistStore((state) => state.loadPlaylist);

  const loadTracks = async () => {
    const playlist = await loadPlaylist(playlistId);
    if (!playlist) {
      return [];
    }
    return playlist.items.map((item) => item.track);
  };

  return useFetchedTracksActions(loadTracks, {
    scope: 'playlists',
    message: t('album:errors.failedToLoadTracks'),
  });
};
