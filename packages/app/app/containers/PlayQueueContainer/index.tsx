import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useLocalPlaylists } from '../PlaylistsContainer/hooks';
import { RootState } from '../../reducers';
import PlayQueue from '../../components/PlayQueue';
import { Playlist, PlaylistTrack } from '@nuclear/core';
import { SettingsState } from '../../reducers/settings';

import { 
  queueDrop,
  repositionSong,
  selectNewStream,
  selectSong,
  removeFromQueue,
  clearQueue,
  reloadTrack
} from '../../actions/queue';
import { addToDownloads } from '../../actions/downloads';
import { info, success } from '../../actions/toasts';
import { resetPlayer } from '../../actions/player';
import { addFavoriteTrack } from '../../actions/favorites';
import { addPlaylist, updatePlaylist } from '../../actions/playlists';
import { toggleOption } from '../../actions/settings';
import { QueueItem } from '../../reducers/queue';
import StreamProviderPlugin from '@nuclear/core/src/plugins/streamProvider';

export type PlayQueueActions = {
  queueDrop: (paths: string[]) => void;
  repositionSong: (from: number, to: number) => void;
  selectNewStream: (index: number, streamId: string) => void;
  selectSong: (index: number) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  resetPlayer: () => void;
  addToDownloads: (providers: StreamProviderPlugin[], track: QueueItem) => void;
  info: (title: string, details: string, icon: React.ReactElement<{ src: string }>, settings: SettingsState) => void;
  success: typeof success;
  addFavoriteTrack: (track: QueueItem) => void;
  addPlaylist: (tracks: PlaylistTrack[], name: string) => void;
  updatePlaylist: (playlist: Playlist) => void;
  toggleOption: typeof toggleOption;
  reloadTrack: (index: number) => void;
}

const PlayQueueContainer: React.FC = () => {
  const dispatch = useDispatch();
  const queue = useSelector((state: RootState) => state.queue);
  const plugins = useSelector((state: RootState) => state.plugin);
  const settings = useSelector((state: RootState) => state.settings);
  const { localPlaylists: playlists } = useLocalPlaylists();

  const actions: PlayQueueActions = React.useMemo(() => ({
    queueDrop: (paths) => dispatch(queueDrop(paths)),
    repositionSong: (from, to) => dispatch(repositionSong(from, to)),
    selectNewStream: (index, streamId) => dispatch(selectNewStream(index, streamId)),
    selectSong: (index) => dispatch(selectSong(index)),
    removeFromQueue: (index) => dispatch(removeFromQueue(index)),
    clearQueue: () => dispatch(clearQueue()),
    resetPlayer: () => dispatch(resetPlayer()),
    addToDownloads: (providers, track) => dispatch(addToDownloads(providers, track)),
    info: (title, details, icon, settings) => dispatch(info(title, details, icon, settings)),
    success: (title, details) => dispatch(success(title, details)),
    addFavoriteTrack: (track) => dispatch(addFavoriteTrack(track)),
    addPlaylist: (tracks, name) => dispatch(addPlaylist(tracks, name)),
    updatePlaylist: (playlist) => dispatch(updatePlaylist(playlist)),
    toggleOption: (option, value) => dispatch(toggleOption(option, value)),
    reloadTrack: (index) => dispatch(reloadTrack(index))
  }), [dispatch]);

  return (
    <PlayQueue
      actions={actions}
      queue={queue}
      plugins={plugins}
      settings={settings}
      playlists={playlists?.data}
    />
  );
};

export default PlayQueueContainer;
