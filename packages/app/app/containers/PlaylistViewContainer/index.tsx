import React, { useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';

import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';
import * as PlaylistActions from '../../actions/playlists';
import PlaylistView from '../../components/PlaylistView';
import { usePlaylistsProps } from '../PlaylistsContainer/hooks';
import { useDispatchedCallback } from '../../hooks/useDispatchedCallback';
import { Playlist } from '@nuclear/core';

type PlaylistViewContainerProps = {
  playlist?: Playlist;
  isExternal?: boolean;
  externalSourceName?: string;
}

const PlaylistViewContainer: React.FC<PlaylistViewContainerProps> = ({
  playlist,
  isExternal,
  externalSourceName
}) => {
  const match = useRouteMatch<{playlistId: string}>();
  const { playlists } = usePlaylistsProps();
  const currentPlaylist = playlist ?? playlists.find(playlist => playlist.id === match.params.playlistId);

  const updatePlaylist = useDispatchedCallback(PlaylistActions.updatePlaylist);
  const deletePlaylist = useDispatchedCallback(PlaylistActions.deletePlaylist);
  const addPlaylist = useDispatchedCallback(PlaylistActions.addPlaylist);
  const exportPlaylist = useDispatchedCallback(PlaylistActions.exportPlaylist);
  const startPlayback = useDispatchedCallback(PlayerActions.startPlayback);
  const clearQueue = useDispatchedCallback(QueueActions.clearQueue);
  const selectSong = useDispatchedCallback(QueueActions.selectSong);
  const addTracks = useDispatchedCallback(QueueActions.addPlaylistTracksToQueue);

  const onReorderTracks = useCallback(
    onReorder(
      currentPlaylist,
      updatePlaylist
    ),
    [playlists]
  );

  return (
    <PlaylistView
      playlist={currentPlaylist}
      addTracks={addTracks}
      selectSong={selectSong}
      startPlayback={startPlayback}
      clearQueue={clearQueue}
      addPlaylist={addPlaylist}
      deletePlaylist={deletePlaylist}
      updatePlaylist={updatePlaylist}
      exportPlaylist={exportPlaylist}
      onReorderTracks={onReorderTracks}
      isExternal={isExternal}
      externalSourceName={externalSourceName}
    />
  );
};

export const onReorder = <T extends { tracks: Array<any> }>(playlist: T, updatePlaylist: (playlist: T) => void) => (indexSource: number, indexDest: number) => {
  const newPlaylist = {...playlist};
  newPlaylist.tracks = [...newPlaylist.tracks];
  const [removed] = newPlaylist.tracks.splice(indexSource, 1);
  newPlaylist.tracks.splice(indexDest, 0, removed);
  updatePlaylist(newPlaylist);
};

export default PlaylistViewContainer;
