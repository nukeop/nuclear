import isEmpty from 'lodash-es/isEmpty';

import { useQueueActions } from '../../../hooks/useQueueActions';
import { playbackManager } from '../../../services/playback';
import { usePlaylistStore } from '../../../stores/playlistStore';

export const usePlaylistQueueActions = (playlistId: string) => {
  const loadPlaylist = usePlaylistStore((state) => state.loadPlaylist);
  const { addToQueue, clearQueue } = useQueueActions();

  const loadTracks = async () => {
    const playlist = await loadPlaylist(playlistId);
    if (!playlist) {
      return [];
    }
    return playlist.items.map((item) => item.track);
  };

  const play = async () => {
    const tracks = await loadTracks();
    if (isEmpty(tracks)) {
      return;
    }
    clearQueue();
    addToQueue(tracks);
    playbackManager.play();
  };

  const enqueue = async () => {
    addToQueue(await loadTracks());
  };

  return { play, enqueue };
};
